import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { createSpreadsheet } from '../lib/googleApi';
import { initializeSheet } from '../lib/parser';
import { DriveSheetPickerModal } from '../components/DriveSheetPickerModal';
import { Plus, FolderSearch, Globe, Sun, Moon, LogOut, Sparkles } from 'lucide-react-native';

export const ConnectSheetScreen: React.FC = () => {
  const { strings, isRTL, theme, toggleTheme, toggleLang, updateSpreadsheetId, logout } = useApp();
  const isDark = theme === 'dark';

  const [isCreating, setIsCreating] = useState(false);
  const [isPickerVisible, setIsPickerVisible] = useState(false);

  const handleCreateSheet = async () => {
    setIsCreating(true);
    try {
      const res = await createSpreadsheet('AutoTracker Maintenance Sync');
      const newId = res.spreadsheetId;
      const firstSheetTitle = res.sheets?.[0]?.properties?.title || 'Sheet1';

      await initializeSheet(newId, firstSheetTitle);
      await updateSpreadsheetId(newId);
    } catch (e: any) {
      console.error('Error creating spreadsheet:', e);
      Alert.alert(isRTL ? 'خطأ' : 'Error', 'Failed to create sheet.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleSelectExistingSheet = async (selectedId: string) => {
    await updateSpreadsheetId(selectedId);
  };

  return (
    <SafeAreaView style={[styles.container, isDark && styles.darkContainer]}>
      {/* Top Bar */}
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

      {/* Main Connect Card */}
      <View style={styles.centerWrapper}>
        <View style={[styles.card, isDark && styles.darkCard]}>
          <Text style={[styles.title, isDark && styles.darkText]}>{strings.connectNewSheet}</Text>
          <Text style={[styles.subtitle, isDark && styles.darkSubtext]}>{strings.connectDesc}</Text>

          <View style={styles.buttonStack}>
            {/* Create New Sheet */}
            <TouchableOpacity
              onPress={handleCreateSheet}
              disabled={isCreating}
              style={styles.createBtn}
            >
              {isCreating ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Sparkles color="#ffffff" size={18} />
                  <Text style={styles.createBtnText}>{strings.createNewSheet}</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={[styles.dividerLine, isDark && styles.darkDivider]} />
              <Text style={[styles.orText, isDark && styles.darkSubtext]}>OR</Text>
              <View style={[styles.dividerLine, isDark && styles.darkDivider]} />
            </View>

            {/* Browse Drive */}
            <TouchableOpacity
              onPress={() => setIsPickerVisible(true)}
              style={[styles.browseBtn, isDark && styles.darkBrowseBtn]}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <FolderSearch color="#059669" size={20} />
                <Text style={[styles.browseBtnText, isDark && styles.darkText]}>{strings.browseDrive}</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Sign Out */}
          <TouchableOpacity onPress={logout} style={styles.signOutBtn}>
            <Text style={styles.signOutText}>{strings.signOut}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Drive Sheet Picker Modal */}
      <DriveSheetPickerModal
        visible={isPickerVisible}
        onClose={() => setIsPickerVisible(false)}
        onSelect={handleSelectExistingSheet}
      />
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
  buttonStack: {
    width: '100%',
    gap: 12,
    marginTop: 8,
  },
  createBtn: {
    backgroundColor: '#059669',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  darkDivider: {
    backgroundColor: '#1e293b',
  },
  orText: {
    marginHorizontal: 12,
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8',
  },
  browseBtn: {
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  darkBrowseBtn: {
    backgroundColor: '#131b2e',
    borderColor: '#1e293b',
  },
  browseBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
  },
  signOutBtn: {
    paddingVertical: 8,
    marginTop: 4,
  },
  signOutText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ef4444',
  },
  darkText: {
    color: '#f8fafc',
  },
  darkSubtext: {
    color: '#94a3b8',
  },
});
