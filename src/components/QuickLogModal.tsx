import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import { addMaintenanceRecord, updateCurrentMileage } from '../lib/parser';
import { useApp } from '../context/AppContext';
import { Fuel, Wrench, X, Check } from 'lucide-react-native';

interface Props {
  visible: boolean;
  type: 'fuel' | 'emergency';
  currentMileage: number;
  onClose: () => void;
  onSuccess: () => void;
}

export const QuickLogModal: React.FC<Props> = ({
  visible,
  type,
  currentMileage,
  onClose,
  onSuccess,
}) => {
  const { strings, isRTL, theme, spreadsheetId } = useApp();
  const isDark = theme === 'dark';

  const [cost, setCost] = useState('');
  const [note, setNote] = useState('');
  const [mileage, setMileage] = useState(currentMileage > 0 ? currentMileage.toString() : '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFuel = type === 'fuel';
  const themeColor = isFuel ? '#f59e0b' : '#ef4444';

  const handleSubmit = async () => {
    if (!cost) {
      Alert.alert(isRTL ? 'تنبيه' : 'Alert', 'Please enter cost');
      return;
    }

    setIsSubmitting(true);
    try {
      const today = new Date();
      const dateString = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;

      const name = isFuel
        ? isRTL ? 'تعبئة وقود' : 'Fuel Refill'
        : note.trim() || (isRTL ? 'إصلاح طارئ' : 'Emergency Fix');

      const parsedMileage = Number(mileage) || currentMileage;

      await addMaintenanceRecord(spreadsheetId, 'Sheet1', {
        name,
        lastMaintenanceDate: dateString,
        mileageAtMaintenance: parsedMileage,
        minMileageForChange: 0,
        maxMileageForChange: 0,
        cost: Number(cost) || 0,
        receiptLink: '',
      });

      // Update vehicle current mileage if higher
      if (parsedMileage > currentMileage) {
        await updateCurrentMileage(spreadsheetId, 'Sheet1', parsedMileage);
      }

      onSuccess();
      onClose();
    } catch (e) {
      console.error(e);
      Alert.alert(isRTL ? 'خطأ' : 'Error', 'Failed to log record');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <SafeAreaView style={[styles.dialog, isDark && styles.darkDialog]}>
          {/* Header Banner */}
          <View style={[styles.dialogHeader, { backgroundColor: themeColor, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 8 }}>
              {isFuel ? <Fuel color="#ffffff" size={20} /> : <Wrench color="#ffffff" size={20} />}
              <Text style={styles.dialogTitle}>{isFuel ? strings.quickFuel : strings.quickEmergency}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.dialogCloseBtn}>
              <X color="#ffffff" size={18} />
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={styles.dialogBody}>
            {!isFuel && (
              <View style={styles.inputGroup}>
                <Text style={[styles.label, isDark && styles.darkSubtext, { textAlign: isRTL ? 'right' : 'left' }]}>
                  {strings.descOrFix} *
                </Text>
                <TextInput
                  value={note}
                  onChangeText={setNote}
                  placeholder={isRTL ? 'مثال: تغيير لمبة، إصلاح إطار' : 'e.g. Tire repair, bulb replacement'}
                  placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                  style={[styles.input, isDark && styles.darkInput, { textAlign: isRTL ? 'right' : 'left' }]}
                />
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={[styles.label, isDark && styles.darkSubtext, { textAlign: isRTL ? 'right' : 'left' }]}>
                {strings.cost} ({strings.currency}) *
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

            <View style={styles.inputGroup}>
              <Text style={[styles.label, isDark && styles.darkSubtext, { textAlign: isRTL ? 'right' : 'left' }]}>
                {strings.currentMileage} ({strings.km})
              </Text>
              <TextInput
                value={mileage}
                onChangeText={setMileage}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                style={[styles.input, isDark && styles.darkInput, { textAlign: isRTL ? 'right' : 'left' }]}
              />
            </View>

            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isSubmitting}
              style={[styles.submitBtn, { backgroundColor: themeColor }]}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Check color="#ffffff" size={16} />
                  <Text style={styles.submitText}>{strings.saveAndRecord}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  dialog: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  darkDialog: {
    backgroundColor: '#111827',
  },
  dialogHeader: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dialogTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  dialogCloseBtn: {
    padding: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  dialogBody: {
    padding: 20,
    gap: 14,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: '#f8fafc',
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
    backgroundColor: '#1f2937',
    borderColor: '#374151',
    color: '#f8fafc',
  },
  submitBtn: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  submitText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  darkSubtext: {
    color: '#94a3b8',
  },
});
