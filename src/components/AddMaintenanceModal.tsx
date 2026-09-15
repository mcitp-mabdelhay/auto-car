import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaintenanceRecord } from '../types';
import { addMaintenanceRecord } from '../lib/parser';
import { uploadReceipt } from '../lib/googleApi';
import { useApp } from '../context/AppContext';
import * as ImagePicker from 'expo-image-picker';
import { X, Check, Camera, Image as ImageIcon, Paperclip, Loader2 } from 'lucide-react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editRecord?: MaintenanceRecord | null;
  editIndex?: number;
  initialMileage?: number;
}

export const AddMaintenanceModal: React.FC<Props> = ({
  visible,
  onClose,
  onSuccess,
  editRecord,
  editIndex,
  initialMileage = 0,
}) => {
  const { strings, isRTL, theme, spreadsheetId } = useApp();
  const isDark = theme === 'dark';

  const [name, setName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [mileage, setMileage] = useState('');
  const [maxMileage, setMaxMileage] = useState('');
  const [cost, setCost] = useState('');
  const [receiptLink, setReceiptLink] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingReceipt, setIsUploadingReceipt] = useState(false);

  useEffect(() => {
    if (editRecord) {
      setName(editRecord.name);
      setDate(editRecord.lastMaintenanceDate || new Date().toISOString().split('T')[0]);
      setMileage(editRecord.mileageAtMaintenance ? editRecord.mileageAtMaintenance.toString() : '');
      setMaxMileage(editRecord.maxMileageForChange ? editRecord.maxMileageForChange.toString() : '');
      setCost(editRecord.cost ? editRecord.cost.toString() : '');
      setReceiptLink(editRecord.receiptLink || '');
    } else {
      setName('');
      setDate(new Date().toISOString().split('T')[0]);
      setMileage(initialMileage > 0 ? initialMileage.toString() : '');
      setMaxMileage('');
      setCost('');
      setReceiptLink('');
    }
  }, [editRecord, visible, initialMileage]);

  const handlePickReceipt = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Camera roll permission is required to upload receipts.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]?.uri) {
        const fileUri = result.assets[0].uri;
        setIsUploadingReceipt(true);
        const fileName = `receipt_${Date.now()}.jpg`;
        const res = await uploadReceipt(fileUri, fileName, 'image/jpeg');
        if (res?.webViewLink) {
          setReceiptLink(res.webViewLink);
          Alert.alert(isRTL ? 'نجاح' : 'Success', strings.receiptAttached);
        }
      }
    } catch (e) {
      console.error('Error uploading receipt:', e);
      Alert.alert(isRTL ? 'خطأ' : 'Error', 'Failed to upload receipt to Google Drive');
    } finally {
      setIsUploadingReceipt(false);
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert(isRTL ? 'تنبيه' : 'Alert', 'Please enter a maintenance name');
      return;
    }

    setIsSubmitting(true);
    try {
      const recordPayload = {
        name: name.trim(),
        lastMaintenanceDate: date,
        mileageAtMaintenance: Number(mileage) || 0,
        minMileageForChange: 0,
        maxMileageForChange: Number(maxMileage) || 0,
        cost: Number(cost) || 0,
        receiptLink: receiptLink,
      };

      if (editRecord && editIndex !== undefined) {
        // +2 offset for header row in Google Sheet
        await addMaintenanceRecord(spreadsheetId, 'Sheet1', recordPayload, editIndex + 2);
      } else {
        await addMaintenanceRecord(spreadsheetId, 'Sheet1', recordPayload);
      }

      onSuccess();
      onClose();
    } catch (e) {
      console.error(e);
      Alert.alert(isRTL ? 'خطأ' : 'Error', 'Failed to save maintenance record');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={[styles.container, isDark && styles.darkContainer]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          {/* Header */}
          <View style={[styles.header, isDark && styles.darkBorder, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Text style={[styles.headerTitle, isDark && styles.darkText]}>
              {editRecord ? (isRTL ? 'تعديل الصيانة' : 'Edit Maintenance') : strings.addMaintenance}
            </Text>
            <TouchableOpacity onPress={onClose} style={[styles.closeBtn, isDark && styles.darkBtn]}>
              <X color={isDark ? '#94a3b8' : '#64748b'} size={20} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Maintenance Name */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, isDark && styles.darkSubtext, { textAlign: isRTL ? 'right' : 'left' }]}>
                {strings.addMaintenance} *
              </Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder={isRTL ? 'مثال: تغيير زيت المحرك والفلتر' : 'e.g. Engine Oil & Filter Change'}
                placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                style={[styles.input, isDark && styles.darkInput, { textAlign: isRTL ? 'right' : 'left' }]}
              />
            </View>

            {/* Date */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, isDark && styles.darkSubtext, { textAlign: isRTL ? 'right' : 'left' }]}>
                {strings.date} (YYYY-MM-DD) *
              </Text>
              <TextInput
                value={date}
                onChangeText={setDate}
                placeholder="2026-08-30"
                placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                style={[styles.input, isDark && styles.darkInput, { textAlign: isRTL ? 'right' : 'left' }]}
              />
            </View>

            {/* Mileage Row */}
            <View style={[styles.row, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={[styles.inputLabel, isDark && styles.darkSubtext, { textAlign: isRTL ? 'right' : 'left' }]}>
                  {strings.mileageAtMaintenance} ({strings.km})
                </Text>
                <TextInput
                  value={mileage}
                  onChangeText={setMileage}
                  keyboardType="numeric"
                  placeholder="95000"
                  placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                  style={[styles.input, isDark && styles.darkInput, { textAlign: isRTL ? 'right' : 'left' }]}
                />
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={[styles.inputLabel, isDark && styles.darkSubtext, { textAlign: isRTL ? 'right' : 'left' }]}>
                  {strings.maxMileageForChange} ({strings.km})
                </Text>
                <TextInput
                  value={maxMileage}
                  onChangeText={setMaxMileage}
                  keyboardType="numeric"
                  placeholder="105000"
                  placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                  style={[styles.input, isDark && styles.darkInput, { textAlign: isRTL ? 'right' : 'left' }]}
                />
              </View>
            </View>

            {/* Cost */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, isDark && styles.darkSubtext, { textAlign: isRTL ? 'right' : 'left' }]}>
                {strings.cost} ({strings.currency})
              </Text>
              <TextInput
                value={cost}
                onChangeText={setCost}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                style={[styles.input, isDark && styles.darkInput, { textAlign: isRTL ? 'right' : 'left' }]}
              />
            </View>

            {/* Attach Receipt */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, isDark && styles.darkSubtext, { textAlign: isRTL ? 'right' : 'left' }]}>
                {strings.uploadReceipt}
              </Text>
              <TouchableOpacity
                onPress={handlePickReceipt}
                disabled={isUploadingReceipt}
                style={[
                  styles.receiptBtn,
                  isDark && styles.darkInput,
                  { flexDirection: isRTL ? 'row-reverse' : 'row' },
                ]}
              >
                {isUploadingReceipt ? (
                  <ActivityIndicator size="small" color="#059669" />
                ) : (
                  <ImageIcon color="#059669" size={20} />
                )}
                <Text style={[styles.receiptBtnText, isDark && styles.darkText]}>
                  {receiptLink ? strings.receiptAttached : strings.uploadReceipt}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Save Button */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isSubmitting || isUploadingReceipt}
              style={[styles.submitBtn, (isSubmitting || isUploadingReceipt) && styles.disabledBtn]}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Check color="#ffffff" size={18} />
                  <Text style={styles.submitBtnText}>{strings.saveAndRecord}</Text>
                </View>
              )}
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
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
    fontSize: 17,
    fontWeight: '700',
    color: '#0f172a',
  },
  closeBtn: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
  },
  darkBtn: {
    backgroundColor: '#1e293b',
  },
  scrollContent: {
    padding: 20,
    gap: 16,
  },
  inputGroup: {
    gap: 6,
  },
  row: {
    gap: 12,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  darkInput: {
    backgroundColor: '#131b2e',
    borderColor: '#1e293b',
    color: '#f8fafc',
  },
  receiptBtn: {
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#059669',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  receiptBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#059669',
  },
  submitBtn: {
    backgroundColor: '#059669',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledBtn: {
    opacity: 0.6,
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  darkText: {
    color: '#f8fafc',
  },
  darkSubtext: {
    color: '#94a3b8',
  },
});
