import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, Alert } from 'react-native';
import { MaintenanceRecord } from '../types';
import { useApp } from '../context/AppContext';
import { Edit2, ExternalLink, Paperclip } from 'lucide-react-native';

interface Props {
  record: MaintenanceRecord;
  currentMileage: number;
  onEdit: (record: MaintenanceRecord) => void;
}

export const MaintenanceCard: React.FC<Props> = ({ record, currentMileage, onEdit }) => {
  const { strings, isRTL, theme } = useApp();
  const isDark = theme === 'dark';

  const getStatus = () => {
    if (!record.maxMileageForChange) {
      return {
        text: isRTL ? 'غير محدد' : 'Not Set',
        bgColor: isDark ? '#1e293b' : '#f1f5f9',
        textColor: isDark ? '#94a3b8' : '#64748b',
        borderColor: isDark ? '#334155' : '#e2e8f0',
      };
    }
    const diff = record.maxMileageForChange - currentMileage;
    if (diff <= 0) {
      return {
        text: strings.overdue,
        bgColor: isDark ? '#450a0a33' : '#fef2f2',
        textColor: '#ef4444',
        borderColor: isDark ? '#7f1d1d55' : '#fee2e2',
      };
    }
    if (diff < 1000) {
      return {
        text: strings.upcoming,
        bgColor: isDark ? '#451a0333' : '#fffbeb',
        textColor: '#d97706',
        borderColor: isDark ? '#78350f55' : '#fef3c7',
      };
    }
    return {
      text: strings.good,
      bgColor: isDark ? '#064e3b33' : '#ecfdf5',
      textColor: '#059669',
      borderColor: isDark ? '#065f4655' : '#d1fae5',
    };
  };

  const status = getStatus();

  const handleOpenReceipt = async () => {
    if (!record.receiptLink) return;
    try {
      const supported = await Linking.canOpenURL(record.receiptLink);
      if (supported) {
        await Linking.openURL(record.receiptLink);
      } else {
        Alert.alert('Error', 'Cannot open link: ' + record.receiptLink);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={[styles.card, isDark && styles.darkCard]}>
      {/* Top Header */}
      <View style={[styles.cardHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 8, flex: 1 }}>
          <View style={[styles.nameAccent, { backgroundColor: '#059669' }]} />
          <Text style={[styles.recordName, isDark && styles.darkText]} numberOfLines={1}>
            {record.name}
          </Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View style={[styles.statusBadge, { backgroundColor: status.bgColor, borderColor: status.borderColor }]}>
            <Text style={[styles.statusText, { color: status.textColor }]}>{status.text}</Text>
          </View>

          <TouchableOpacity
            onPress={() => onEdit(record)}
            style={[styles.editBtn, isDark && styles.darkEditBtn]}
          >
            <Edit2 color={isDark ? '#94a3b8' : '#64748b'} size={14} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Grid of stats */}
      <View style={styles.statsGrid}>
        <View style={[styles.gridRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <View style={[styles.statBox, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
            <Text style={[styles.statLabel, isDark && styles.darkSubtext]}>{strings.mileageAtMaintenance}</Text>
            <Text style={[styles.statValue, isDark && styles.darkText]}>
              {record.mileageAtMaintenance ? `${record.mileageAtMaintenance.toLocaleString()} ${strings.km}` : '-'}
            </Text>
          </View>

          <View style={[styles.statBox, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
            <Text style={[styles.statLabel, isDark && styles.darkSubtext]}>{strings.maxMileageForChange}</Text>
            <Text style={[styles.statValue, isDark && styles.darkText]}>
              {record.maxMileageForChange ? `${record.maxMileageForChange.toLocaleString()} ${strings.km}` : '-'}
            </Text>
          </View>
        </View>

        <View style={[styles.gridRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <View style={[styles.statBox, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
            <Text style={[styles.statLabel, isDark && styles.darkSubtext]}>{strings.cost}</Text>
            <Text style={[styles.statValue, { color: '#059669' }]}>
              {record.cost ? `${record.cost.toLocaleString()} ${strings.currency}` : '-'}
            </Text>
          </View>

          <View style={[styles.statBox, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
            <Text style={[styles.statLabel, isDark && styles.darkSubtext]}>{strings.viewReceipt}</Text>
            {record.receiptLink ? (
              <TouchableOpacity
                onPress={handleOpenReceipt}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}
              >
                <Paperclip color="#059669" size={12} />
                <Text style={styles.receiptLinkText}>{strings.viewReceipt}</Text>
                <ExternalLink color="#059669" size={12} />
              </TouchableOpacity>
            ) : (
              <Text style={[styles.statValue, isDark && styles.darkSubtext]}>-</Text>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    marginBottom: 8,
    gap: 12,
  },
  darkCard: {
    backgroundColor: '#111827',
    borderColor: '#1e293b',
  },
  cardHeader: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameAccent: {
    width: 3,
    height: 16,
    borderRadius: 2,
  },
  recordName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  editBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
  },
  darkEditBtn: {
    backgroundColor: '#1f2937',
  },
  statsGrid: {
    gap: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  gridRow: {
    justifyContent: 'space-between',
  },
  statBox: {
    flex: 1,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748b',
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginTop: 2,
  },
  receiptLinkText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
    textDecorationLine: 'underline',
  },
  darkText: {
    color: '#f8fafc',
  },
  darkSubtext: {
    color: '#94a3b8',
  },
});
