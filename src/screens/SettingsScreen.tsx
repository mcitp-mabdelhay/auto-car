import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Linking,
  Alert,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { DriveSheetPickerModal } from '../components/DriveSheetPickerModal';
import {
  FileSpreadsheet,
  FolderSearch,
  ExternalLink,
  Globe,
  Sun,
  Moon,
  LogOut,
  Unlink,
  User,
  Settings as SettingsIcon,
} from 'lucide-react-native';

export const SettingsScreen: React.FC = () => {
  const {
    spreadsheetId,
    user,
    lang,
    theme,
    strings,
    isRTL,
    toggleLang,
    toggleTheme,
    updateSpreadsheetId,
    logout,
    setActiveTab,
  } = useApp();

  const isDark = theme === 'dark';
  const [isPickerVisible, setIsPickerVisible] = useState(false);

  const handleOpenSheetInBrowser = async () => {
    if (!spreadsheetId) return;
    const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}`;
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
  };

  const handleDisconnectSheet = () => {
    Alert.alert(
      isRTL ? 'تأكيد' : 'Confirm',
      isRTL ? 'هل أنت متأكد من رغبتك في إلغاء ربط جدول البيانات؟' : 'Are you sure you want to disconnect this sheet?',
      [
        { text: strings.cancel, style: 'cancel' },
        {
          text: strings.disconnectSheet,
          style: 'destructive',
          onPress: async () => {
            await updateSpreadsheetId('');
            setActiveTab('home');
          },
        },
      ]
    );
  };

  const handleSelectNewSheet = async (newId: string) => {
    await updateSpreadsheetId(newId);
    setActiveTab('home');
  };

  return (
    <SafeAreaView style={[styles.safeArea, isDark && styles.darkContainer]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* User Card */}
        {user && (
          <View style={[styles.card, isDark && styles.darkCard, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <View style={styles.userAvatarBox}>
              <User color="#059669" size={24} />
            </View>
            <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
              <Text style={[styles.userName, isDark && styles.darkText]}>{user.name || 'User'}</Text>
              <Text style={[styles.userEmail, isDark && styles.darkSubtext]}>{user.email || ''}</Text>
            </View>
          </View>
        )}

        {/* 1. Connected Sheet Info */}
        <View style={[styles.card, isDark && styles.darkCard]}>
          <Text style={[styles.cardSectionTitle, isDark && styles.darkText, { textAlign: isRTL ? 'right' : 'left' }]}>
            Google Spreadsheet
          </Text>

          <View style={[styles.idBox, isDark && styles.darkIdBox]}>
            <Text style={[styles.idText, isDark && styles.darkSubtext]} numberOfLines={2}>
              {spreadsheetId || 'No sheet connected'}
            </Text>
          </View>

          {spreadsheetId ? (
            <TouchableOpacity
              onPress={handleOpenSheetInBrowser}
              style={[styles.openInSheetsBtn, { flexDirection: 'row' }]}
            >
              <FileSpreadsheet color="#059669" size={18} />
              <Text style={styles.openInSheetsText}>Open in Google Sheets</Text>
              <ExternalLink color="#059669" size={16} />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* 2. Switch Sheet */}
        <View style={[styles.card, isDark && styles.darkCard]}>
          <Text style={[styles.cardSectionTitle, isDark && styles.darkText, { textAlign: isRTL ? 'right' : 'left' }]}>
            {strings.connectNewSheet}
          </Text>
          <Text style={[styles.cardDesc, isDark && styles.darkSubtext, { textAlign: isRTL ? 'right' : 'left' }]}>
            {strings.connectDesc}
          </Text>

          <TouchableOpacity
            onPress={() => setIsPickerVisible(true)}
            style={[styles.actionBtn, isDark && styles.darkActionBtn, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
          >
            <FolderSearch color="#059669" size={20} />
            <Text style={[styles.actionBtnText, isDark && styles.darkText]}>{strings.browseDrive}</Text>
          </TouchableOpacity>
        </View>

        {/* 3. Preferences (Theme & Language) */}
        <View style={[styles.card, isDark && styles.darkCard]}>
          <Text style={[styles.cardSectionTitle, isDark && styles.darkText, { textAlign: isRTL ? 'right' : 'left' }]}>
            {strings.appSettings}
          </Text>

          {/* Theme Row */}
          <TouchableOpacity
            onPress={toggleTheme}
            style={[styles.settingRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
          >
            <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 10 }}>
              {isDark ? <Sun color="#f59e0b" size={20} /> : <Moon color="#6366f1" size={20} />}
              <Text style={[styles.settingLabel, isDark && styles.darkText]}>{strings.theme}</Text>
            </View>
            <Text style={[styles.settingValue, isDark && styles.darkSubtext]}>
              {isDark ? strings.darkMode : strings.lightMode}
            </Text>
          </TouchableOpacity>

          {/* Language Row */}
          <TouchableOpacity
            onPress={toggleLang}
            style={[styles.settingRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
          >
            <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 10 }}>
              <Globe color="#059669" size={20} />
              <Text style={[styles.settingLabel, isDark && styles.darkText]}>{strings.language}</Text>
            </View>
            <Text style={[styles.settingValue, isDark && styles.darkSubtext]}>
              {lang === 'ar' ? 'العربية' : 'English'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* 4. Disconnect & Sign Out */}
        <View style={{ gap: 10, marginTop: 6 }}>
          {spreadsheetId ? (
            <TouchableOpacity
              onPress={handleDisconnectSheet}
              style={[styles.disconnectBtn, isDark && styles.darkDisconnectBtn, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
            >
              <Unlink color="#ef4444" size={18} />
              <Text style={styles.disconnectText}>{strings.disconnectSheet}</Text>
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity
            onPress={logout}
            style={[styles.signOutBtn, isDark && styles.darkSignOutBtn, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
          >
            <LogOut color="#64748b" size={18} />
            <Text style={[styles.signOutText, isDark && styles.darkSubtext]}>{strings.signOut}</Text>
          </TouchableOpacity>

          {/* App Version Footer */}
          <View style={styles.versionFooter}>
            <Text style={[styles.versionText, isDark && styles.darkSubtext]}>
              AutoTracker v1.1.0
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Drive Picker Modal */}
      <DriveSheetPickerModal
        visible={isPickerVisible}
        onClose={() => setIsPickerVisible(false)}
        onSelect={handleSelectNewSheet}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  darkContainer: {
    backgroundColor: '#090d16',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
    gap: 14,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    gap: 12,
  },
  darkCard: {
    backgroundColor: '#111827',
    borderColor: '#1e293b',
  },
  userAvatarBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ecfdf5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  userEmail: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  cardSectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  cardDesc: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 16,
  },
  idBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  darkIdBox: {
    backgroundColor: '#131b2e',
    borderColor: '#1e293b',
  },
  idText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#475569',
  },
  openInSheetsBtn: {
    backgroundColor: '#ecfdf5',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  openInSheetsText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#059669',
  },
  actionBtn: {
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  darkActionBtn: {
    backgroundColor: '#131b2e',
    borderColor: '#1e293b',
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  settingRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  settingValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  disconnectBtn: {
    backgroundColor: '#fee2e2',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  darkDisconnectBtn: {
    backgroundColor: '#450a0a33',
  },
  disconnectText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ef4444',
  },
  signOutBtn: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  darkSignOutBtn: {
    backgroundColor: '#131b2e',
    borderColor: '#1e293b',
  },
  signOutText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748b',
  },
  darkText: {
    color: '#f8fafc',
  },
  darkSubtext: {
    color: '#94a3b8',
  },
  versionFooter: {
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: 8,
  },
  versionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94a3b8',
    letterSpacing: 0.5,
  },
});
