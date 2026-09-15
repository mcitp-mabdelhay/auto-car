import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { MaintenanceRecord } from '../types';
import { useApp } from '../context/AppContext';
import { createCalendarEvent, sendEmail } from '../lib/googleApi';
import { Bell, Calendar, Mail, Check, AlertTriangle, CheckCircle2, Clock } from './Icons';

interface Props {
  upcomingMaintenance: MaintenanceRecord[];
  overdueMaintenance: MaintenanceRecord[];
  currentMileage: number;
}

export const RemindersSection: React.FC<Props> = ({
  upcomingMaintenance,
  overdueMaintenance,
  currentMileage,
}) => {
  const { strings, isRTL, theme, user } = useApp();
  const isDark = theme === 'dark';

  const [addingToCalendar, setAddingToCalendar] = useState<string | null>(null);
  const [addedToCalendar, setAddedToCalendar] = useState<Set<string>>(new Set());

  const [sendingEmail, setSendingEmail] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState<Set<string>>(new Set());

  const handleAddToCalendar = async (record: MaintenanceRecord) => {
    setAddingToCalendar(record.id);
    try {
      const date = new Date(Date.now() + 86400000).toISOString().split('T')[0];
      await createCalendarEvent(
        `Maintenance Due: ${record.name}`,
        `Upcoming maintenance for your vehicle. Target: ${record.maxMileageForChange} km. Current: ${currentMileage} km.`,
        date
      );
      setAddedToCalendar(prev => new Set(prev).add(record.id));
      Alert.alert(isRTL ? 'نجاح' : 'Success', strings.addedToCalendar);
    } catch (e) {
      console.error(e);
      Alert.alert(isRTL ? 'خطأ' : 'Error', 'Failed to add to calendar');
    } finally {
      setAddingToCalendar(null);
    }
  };

  const handleSendReminderEmail = async (record: MaintenanceRecord) => {
    if (!user?.email) {
      Alert.alert(isRTL ? 'تنبيه' : 'Alert', 'User email not found');
      return;
    }

    setSendingEmail(record.id);
    try {
      const isArabic = isRTL;
      await sendEmail(
        user.email,
        isArabic ? `⚠️ تنبيه صيانة متأخرة: ${record.name}` : `⚠️ Overdue Maintenance Alert: ${record.name}`,
        `<div dir="${isArabic ? 'rtl' : 'ltr'}" style="font-family: sans-serif;">
          <h2>${isArabic ? 'صيانة مستحقة فوراً!' : 'Maintenance Overdue!'}</h2>
          <p>${isArabic ? 'لقد تجاوزت العداد الأقصى للصيانة التالية:' : 'You have exceeded the maximum mileage for the following maintenance:'}</p>
          <ul>
            <li><strong>${record.name}</strong></li>
            <li>${isArabic ? 'الموعد الأقصى:' : 'Max Mileage:'} ${record.maxMileageForChange} ${strings.km}</li>
            <li>${isArabic ? 'العداد الحالي:' : 'Current Mileage:'} ${currentMileage} ${strings.km}</li>
          </ul>
          <p>${isArabic ? 'يرجى تحديد موعد للصيانة في أقرب وقت ممكن لتجنب الأضرار.' : 'Please schedule a service as soon as possible to avoid vehicle damage.'}</p>
        </div>`
      );
      setEmailSent(prev => new Set(prev).add(record.id));
      Alert.alert(isRTL ? 'نجاح' : 'Success', strings.emailSent);
    } catch (e) {
      console.error(e);
      Alert.alert(isRTL ? 'خطأ' : 'Error', 'Failed to send email');
    } finally {
      setSendingEmail(null);
    }
  };

  if (upcomingMaintenance.length === 0 && overdueMaintenance.length === 0) {
    return (
      <View style={[styles.card, isDark && styles.darkCard, styles.emptyContainer]}>
        <View style={[styles.emptyIconBox, isDark && styles.darkEmeraldIconBox]}>
          <CheckCircle2 color="#059669" size={28} />
        </View>
        <Text style={[styles.cardTitle, isDark && styles.darkText]}>{strings.reminders}</Text>
        <Text style={[styles.emptySubtitle, isDark && styles.darkSubtext]}>{strings.noReminders}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.card, isDark && styles.darkCard]}>
      {/* Header */}
      <View style={[styles.headerRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 8 }}>
          <Bell color="#059669" size={20} />
          <Text style={[styles.cardTitle, isDark && styles.darkText]}>{strings.reminders}</Text>
        </View>
        <Text style={[styles.headerSubtitle, isDark && styles.darkSubtext]}>{strings.remindersDesc}</Text>
      </View>

      {/* Items list */}
      <View style={styles.itemsList}>
        {/* Overdue */}
        {overdueMaintenance.map(record => {
          const isSent = emailSent.has(record.id);
          const isSending = sendingEmail === record.id;

          return (
            <View
              key={record.id}
              style={[styles.itemRow, styles.overdueRow, isDark && styles.darkOverdueRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
            >
              <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                <View style={[styles.iconBox, { backgroundColor: '#fee2e2' }]}>
                  <AlertTriangle color="#ef4444" size={18} />
                </View>
                <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
                  <Text style={[styles.itemName, isDark && styles.darkText]} numberOfLines={1}>
                    {record.name}
                  </Text>
                  <Text style={styles.overdueSubtext}>
                    {strings.overdue} • {record.maxMileageForChange?.toLocaleString()} {strings.km}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => handleSendReminderEmail(record)}
                disabled={isSent || isSending}
                style={[
                  styles.actionBtn,
                  isSent ? styles.sentBtn : isDark ? styles.darkActionBtn : styles.lightActionBtn,
                ]}
              >
                {isSending ? (
                  <ActivityIndicator size="small" color="#64748b" />
                ) : isSent ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Check color="#059669" size={14} />
                    <Text style={[styles.btnText, { color: '#059669' }]}>{strings.emailSent}</Text>
                  </View>
                ) : (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Mail color={isDark ? '#94a3b8' : '#64748b'} size={14} />
                    <Text style={[styles.btnText, isDark && styles.darkText]}>{strings.sendReminderEmail}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          );
        })}

        {/* Upcoming */}
        {upcomingMaintenance.map(record => {
          const isAdded = addedToCalendar.has(record.id);
          const isAdding = addingToCalendar === record.id;

          return (
            <View
              key={record.id}
              style={[styles.itemRow, styles.upcomingRow, isDark && styles.darkUpcomingRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
            >
              <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                <View style={[styles.iconBox, { backgroundColor: '#fef3c7' }]}>
                  <Clock color="#d97706" size={18} />
                </View>
                <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
                  <Text style={[styles.itemName, isDark && styles.darkText]} numberOfLines={1}>
                    {record.name}
                  </Text>
                  <Text style={styles.upcomingSubtext}>
                    {strings.upcoming} • {record.maxMileageForChange?.toLocaleString()} {strings.km}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => handleAddToCalendar(record)}
                disabled={isAdded || isAdding}
                style={[
                  styles.actionBtn,
                  isAdded ? styles.sentBtn : isDark ? styles.darkActionBtn : styles.lightActionBtn,
                ]}
              >
                {isAdding ? (
                  <ActivityIndicator size="small" color="#64748b" />
                ) : isAdded ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Check color="#059669" size={14} />
                    <Text style={[styles.btnText, { color: '#059669' }]}>{strings.addedToCalendar}</Text>
                  </View>
                ) : (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Calendar color={isDark ? '#94a3b8' : '#64748b'} size={14} />
                    <Text style={[styles.btnText, isDark && styles.darkText]}>{strings.addToCalendar}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    gap: 14,
  },
  darkCard: {
    backgroundColor: '#111827',
    borderColor: '#1e293b',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 28,
  },
  emptyIconBox: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#ecfdf5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  darkEmeraldIconBox: {
    backgroundColor: '#064e3b33',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 4,
  },
  headerRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  headerSubtitle: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748b',
    textTransform: 'uppercase',
  },
  itemsList: {
    gap: 10,
  },
  itemRow: {
    padding: 12,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  overdueRow: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fee2e2',
  },
  darkOverdueRow: {
    backgroundColor: '#450a0a22',
    borderColor: '#7f1d1d44',
  },
  upcomingRow: {
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: '#fef3c7',
  },
  darkUpcomingRow: {
    backgroundColor: '#451a0322',
    borderColor: '#78350f44',
  },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  overdueSubtext: {
    fontSize: 11,
    fontWeight: '600',
    color: '#ef4444',
    marginTop: 2,
  },
  upcomingSubtext: {
    fontSize: 11,
    fontWeight: '600',
    color: '#d97706',
    marginTop: 2,
  },
  actionBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
  },
  lightActionBtn: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
  },
  darkActionBtn: {
    backgroundColor: '#1f2937',
    borderColor: '#374151',
  },
  sentBtn: {
    backgroundColor: '#ecfdf5',
    borderColor: '#a7f3d0',
  },
  btnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  darkText: {
    color: '#f8fafc',
  },
  darkSubtext: {
    color: '#94a3b8',
  },
});
