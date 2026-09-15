import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Alert,
  Image,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { Car, Globe, Sun, Moon, AlertCircle, LogIn } from 'lucide-react-native';

export const AuthScreen: React.FC = () => {
  const { strings, isRTL, theme, toggleTheme, toggleLang, login } = useApp();
  const isDark = theme === 'dark';
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      await login();
    } catch (e: any) {
      console.error('Login error:', e);
      Alert.alert(isRTL ? 'خطأ' : 'Error', e.message || 'Login failed. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, isDark && styles.darkContainer]}>
      {/* Top Bar Toggles */}
      <View style={[styles.topBar, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <TouchableOpacity
          onPress={toggleTheme}
          style={[styles.iconButton, isDark && styles.darkIconButton]}
        >
          {isDark ? <Sun color="#f59e0b" size={20} /> : <Moon color="#6366f1" size={20} />}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={toggleLang}
          style={[styles.langButton, isDark && styles.darkIconButton, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
        >
          <Globe color="#059669" size={16} />
          <Text style={[styles.langButtonText, isDark && styles.darkText]}>
            {isRTL ? 'English' : 'العربية'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Main Login Card */}
      <View style={styles.centerWrapper}>
        <View style={[styles.card, isDark && styles.darkCard]}>
          {/* Logo Icon */}
          <View style={styles.logoBox}>
            <Image
              source={require('../../assets/icon.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          {/* Title & Desc */}
          <Text style={[styles.title, isDark && styles.darkText]}>{strings.appTitle}</Text>
          <Text style={[styles.subtitle, isDark && styles.darkSubtext]}>{strings.syncDesc}</Text>

          {/* Google Sign In Button */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={isLoggingIn}
            style={[styles.googleBtn, isDark && styles.darkGoogleBtn]}
          >
            {isLoggingIn ? (
              <ActivityIndicator color="#059669" size="small" />
            ) : (
              <View style={[styles.btnInner, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <LogIn color="#059669" size={20} />
                <Text style={[styles.googleBtnText, isDark && styles.darkText]}>{strings.signIn}</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Scope Note */}
          <View style={[styles.alertBox, isDark && styles.darkAlertBox, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <AlertCircle color="#059669" size={20} style={{ marginTop: 2 }} />
            <Text style={[styles.alertText, isDark && styles.darkAlertText, { textAlign: isRTL ? 'right' : 'left' }]}>
              {isRTL
                ? 'عند تسجيل الدخول، ستحتاج لمنح الإذن لجداول بيانات Google و Drive و Gmail والتقويم لتمكين المزامنة التلقائية.'
                : 'At first run, you will need to grant permissions for Google Sheets, Drive, Gmail, and Calendar to enable full functionality.'}
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  darkContainer: {
    backgroundColor: '#090d16',
  },
  topBar: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    justifyContent: 'flex-end',
    gap: 10,
  },
  iconButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  darkIconButton: {
    backgroundColor: '#131b2e',
    borderColor: '#1e293b',
  },
  langButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    gap: 6,
  },
  langButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  centerWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#ffffff',
    borderRadius: 28,
    padding: 28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    gap: 16,
  },
  darkCard: {
    backgroundColor: '#111827',
    borderColor: '#1e293b',
  },
  logoBox: {
    width: 72,
    height: 72,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  logoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 22,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 18,
  },
  googleBtn: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  darkGoogleBtn: {
    backgroundColor: '#131b2e',
    borderColor: '#1e293b',
  },
  btnInner: {
    alignItems: 'center',
    gap: 10,
  },
  googleBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
  },
  alertBox: {
    backgroundColor: '#ecfdf5',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#a7f3d0',
    gap: 10,
    alignItems: 'flex-start',
  },
  darkAlertBox: {
    backgroundColor: '#064e3b22',
    borderColor: '#065f4655',
  },
  alertText: {
    flex: 1,
    fontSize: 12,
    color: '#065f46',
    lineHeight: 18,
  },
  darkAlertText: {
    color: '#6ee7b7',
  },
  darkText: {
    color: '#f8fafc',
  },
  darkSubtext: {
    color: '#94a3b8',
  },
});
