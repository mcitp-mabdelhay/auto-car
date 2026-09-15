import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { GoogleDriveFile } from '../types';
import { listSpreadsheets } from '../lib/googleApi';
import { useApp } from '../context/AppContext';
import { FileSpreadsheet, Search, X, RefreshCw } from 'lucide-react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (spreadsheetId: string, title: string) => void;
}

export const DriveSheetPickerModal: React.FC<Props> = ({ visible, onClose, onSelect }) => {
  const { strings, isRTL, theme } = useApp();
  const [files, setFiles] = useState<GoogleDriveFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  const isDark = theme === 'dark';

  const loadFiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listSpreadsheets();
      setFiles(data);
    } catch (e: any) {
      console.error('Failed to load drive files:', e);
      setError(e.message || 'Failed to load files from Google Drive');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      loadFiles();
    }
  }, [visible]);

  const filteredFiles = files.filter(f =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={[styles.container, isDark && styles.darkContainer]}>
        {/* Header */}
        <View style={[styles.header, isDark && styles.darkBorder, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 8 }}>
            <FileSpreadsheet color="#059669" size={24} />
            <Text style={[styles.headerTitle, isDark && styles.darkText]}>{strings.selectSpreadsheet}</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={[styles.closeBtn, isDark && styles.darkBtn]}>
            <X color={isDark ? '#94a3b8' : '#64748b'} size={20} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={[styles.searchContainer, isDark && styles.darkInputBg, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <Search color={isDark ? '#94a3b8' : '#64748b'} size={18} />
          <TextInput
            placeholder={strings.searchSpreadsheets}
            placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={[styles.searchInput, isDark && styles.darkText, { textAlign: isRTL ? 'right' : 'left' }]}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X color="#94a3b8" size={16} />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Content */}
        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#059669" />
            <Text style={[styles.loadingText, isDark && styles.darkSubtext]}>{strings.loading}</Text>
          </View>
        ) : error ? (
          <View style={styles.centerContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={loadFiles} style={styles.retryBtn}>
              <RefreshCw color="#ffffff" size={16} />
              <Text style={styles.retryBtnText}>{strings.retry}</Text>
            </TouchableOpacity>
          </View>
        ) : filteredFiles.length === 0 ? (
          <View style={styles.centerContainer}>
            <Text style={[styles.emptyText, isDark && styles.darkSubtext]}>{strings.noSpreadsheetsFound}</Text>
          </View>
        ) : (
          <FlatList
            data={filteredFiles}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.fileItem, isDark && styles.darkFileItem, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
                onPress={() => {
                  onSelect(item.id, item.name);
                  onClose();
                }}
              >
                <View style={styles.fileIconBox}>
                  <FileSpreadsheet color="#059669" size={20} />
                </View>
                <View style={[styles.fileDetails, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
                  <Text style={[styles.fileName, isDark && styles.darkText]} numberOfLines={1}>
                    {item.name}
                  </Text>
                  {item.modifiedTime ? (
                    <Text style={[styles.fileDate, isDark && styles.darkSubtext]}>
                      {new Date(item.modifiedTime).toLocaleDateString()}
                    </Text>
                  ) : null}
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </SafeAreaView>
    </Modal>
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
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  darkBorder: {
    borderBottomColor: '#1e293b',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  darkText: {
    color: '#f8fafc',
  },
  darkSubtext: {
    color: '#94a3b8',
  },
  closeBtn: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
  },
  darkBtn: {
    backgroundColor: '#1e293b',
  },
  searchContainer: {
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    gap: 8,
  },
  darkInputBg: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0f172a',
    paddingVertical: 2,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  fileItem: {
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 8,
    alignItems: 'center',
    gap: 12,
  },
  darkFileItem: {
    backgroundColor: '#131b2e',
    borderColor: '#1e293b',
  },
  fileIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#ecfdf5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileDetails: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  fileDate: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748b',
  },
  errorText: {
    fontSize: 14,
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#059669',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryBtnText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 13,
  },
});
