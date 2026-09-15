import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Linking,
  StatusBar,
} from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppProvider, useApp } from './context/AppContext';
import { AuthScreen } from './screens/AuthScreen';
import { ConnectSheetScreen } from './screens/ConnectSheetScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import {
  Car,
  SettingsIcon,
  LogOut,
  Globe,
  Sun,
  Moon,
  ExternalLink,
} from './components/Icons';

const MainNavigator: React.FC = () => {
  const {
    token,
    spreadsheetId,
    activeTab,
    setActiveTab,
    strings,
    isRTL,
    theme,
    toggleTheme,
    toggleLang,
    logout,
    isLoadingAuth,
  } = useApp();

  const insets = useSafeAreaInsets();
  const isDark = theme === 'dark';

  if (isLoadingAuth) {
    return (
      <View style={[styles.loadingScreen, isDark && styles.darkContainer]}>
        <ActivityIndicator size="large" color="#059669" />
        <Text style={[styles.loadingText, isDark && styles.darkSubtext]}>{strings.loading}</Text>
      </View>
    );
  }

  // 1. Not Authenticated
  if (!token) {
    return <AuthScreen />;
  }

  // 2. Authenticated but No Sheet Connected
  if (!spreadsheetId) {
    return <ConnectSheetScreen />;
  }

  // 3. Main Application Dashboard & Settings
  const handleOpenSheetInBrowser = async () => {
    if (!spreadsheetId) return;
    const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}`;
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
  };

  return (
    <SafeAreaView style={[styles.appContainer, isDark && styles.darkContainer]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? '#090d16' : '#ffffff'}
      />

      {/* Top Application Header */}
      <View style={[styles.topHeader, isDark && styles.darkHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 10 }}>
          <View style={styles.headerLogoBox}>
            <Car color="#ffffff" size={20} />
          </View>
          <Text style={[styles.headerTitle, isDark && styles.darkText]}>AutoTracker</Text>
        </View>

        <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 6 }}>
          <TouchableOpacity onPress={toggleTheme} style={[styles.headerIconBtn, isDark && styles.darkIconBtn]}>
            {isDark ? <Sun color="#f59e0b" size={18} /> : <Moon color="#6366f1" size={18} />}
          </TouchableOpacity>

          <TouchableOpacity onPress={toggleLang} style={[styles.headerIconBtn, isDark && styles.darkIconBtn]}>
            <Globe color="#059669" size={18} />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleOpenSheetInBrowser} style={[styles.headerIconBtn, isDark && styles.darkIconBtn]}>
            <ExternalLink color={isDark ? '#94a3b8' : '#64748b'} size={18} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Screen Content */}
      <View style={{ flex: 1 }}>
        {activeTab === 'home' ? <DashboardScreen /> : <SettingsScreen />}
      </View>

      {/* Bottom Navigation Bar */}
      <View
        style={[
          styles.bottomNav,
          isDark && styles.darkBottomNav,
          {
            paddingBottom: Math.max(insets.bottom, 12),
            flexDirection: isRTL ? 'row-reverse' : 'row',
          },
        ]}
      >
        {/* Home Tab */}
        <TouchableOpacity
          onPress={() => setActiveTab('home')}
          style={styles.navTab}
        >
          <Car color={activeTab === 'home' ? '#059669' : isDark ? '#64748b' : '#94a3b8'} size={22} />
          <Text
            style={[
              styles.navTabText,
              activeTab === 'home'
                ? styles.navTabTextActive
                : isDark
                ? styles.darkSubtext
                : styles.navTabTextInactive,
            ]}
          >
            {strings.home}
          </Text>
        </TouchableOpacity>

        {/* Settings Tab */}
        <TouchableOpacity
          onPress={() => setActiveTab('settings')}
          style={styles.navTab}
        >
          <SettingsIcon color={activeTab === 'settings' ? '#059669' : isDark ? '#64748b' : '#94a3b8'} size={22} />
          <Text
            style={[
              styles.navTabText,
              activeTab === 'settings'
                ? styles.navTabTextActive
                : isDark
                ? styles.darkSubtext
                : styles.navTabTextInactive,
            ]}
          >
            {strings.settings}
          </Text>
        </TouchableOpacity>

        {/* Sign Out Button */}
        <TouchableOpacity onPress={logout} style={styles.navTab}>
          <LogOut color="#ef4444" size={22} />
          <Text style={[styles.navTabText, { color: '#ef4444' }]}>{strings.signOut}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <MainNavigator />
      </AppProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  darkContainer: {
    backgroundColor: '#090d16',
  },
  loadingScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748b',
  },
  topHeader: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  darkHeader: {
    backgroundColor: '#111827',
    borderBottomColor: '#1e293b',
  },
  headerLogoBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: -0.5,
  },
  headerIconBtn: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
  },
  darkIconBtn: {
    backgroundColor: '#1f2937',
  },
  bottomNav: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 10,
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 8,
  },
  darkBottomNav: {
    backgroundColor: '#111827',
    borderTopColor: '#1e293b',
  },
  navTab: {
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 16,
  },
  navTabText: {
    fontSize: 10,
    fontWeight: '700',
  },
  navTabTextActive: {
    color: '#059669',
  },
  navTabTextInactive: {
    color: '#64748b',
  },
  darkText: {
    color: '#f8fafc',
  },
  darkSubtext: {
    color: '#94a3b8',
  },
});
