import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaintenanceRecord } from '../types';
import { useApp } from '../context/AppContext';

interface Props {
  records: MaintenanceRecord[];
}

export const SpendingChart: React.FC<Props> = ({ records }) => {
  const { strings, isRTL, theme } = useApp();
  const isDark = theme === 'dark';

  const chartData = records
    .filter(r => r.cost && r.cost > 0)
    .map(r => ({
      name: r.name,
      cost: r.cost || 0,
    }))
    .sort((a, b) => b.cost - a.cost)
    .slice(0, 5);

  const maxCost = chartData.length > 0 ? Math.max(...chartData.map(d => d.cost)) : 0;

  if (chartData.length === 0) {
    return (
      <View style={[styles.emptyBox, isDark && styles.darkEmptyBox]}>
        <Text style={[styles.emptyText, isDark && styles.darkSubtext]}>{strings.noCostData}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {chartData.map((item, index) => {
        const percentage = maxCost > 0 ? (item.cost / maxCost) * 100 : 0;
        return (
          <View key={`${item.name}-${index}`} style={styles.barRow}>
            {/* Header: Label & Cost */}
            <View style={[styles.labelRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Text style={[styles.itemName, isDark && styles.darkText]} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={[styles.itemCost, isDark && styles.darkEmeraldText]}>
                {item.cost.toLocaleString()} {strings.currency}
              </Text>
            </View>

            {/* Progress Bar Background */}
            <View style={[styles.barTrack, isDark && styles.darkBarTrack, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <View
                style={[
                  styles.barFill,
                  {
                    width: `${Math.max(percentage, 5)}%`,
                    backgroundColor: index === 0 ? '#059669' : index === 1 ? '#10b981' : '#34d399',
                  },
                ]}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 14,
    paddingVertical: 4,
  },
  barRow: {
    gap: 6,
  },
  labelRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    flex: 1,
  },
  itemCost: {
    fontSize: 13,
    fontWeight: '700',
    color: '#059669',
    marginHorizontal: 8,
  },
  barTrack: {
    height: 10,
    borderRadius: 6,
    backgroundColor: '#f1f5f9',
    overflow: 'hidden',
  },
  darkBarTrack: {
    backgroundColor: '#1e293b',
  },
  barFill: {
    height: '100%',
    borderRadius: 6,
  },
  emptyBox: {
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#e2e8f0',
  },
  darkEmptyBox: {
    borderColor: '#1e293b',
  },
  emptyText: {
    fontSize: 13,
    color: '#94a3b8',
  },
  darkText: {
    color: '#f8fafc',
  },
  darkSubtext: {
    color: '#94a3b8',
  },
  darkEmeraldText: {
    color: '#34d399',
  },
});
