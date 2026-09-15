import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
  SafeAreaView,
  Linking,
} from 'react-native';
import { DashboardData, MaintenanceRecord } from '../types';
import {
  loadVehicleData,
  updateCurrentMileage,
  updateVehicleName,
} from '../lib/parser';
import { sendEmail } from '../lib/googleApi';
import { useApp } from '../context/AppContext';
import { RemindersSection } from '../components/RemindersSection';
import { SpendingChart } from '../components/SpendingChart';
import { MaintenanceCard } from '../components/MaintenanceCard';
import { AddMaintenanceModal } from '../components/AddMaintenanceModal';
import { QuickLogModal } from '../components/QuickLogModal';
import {
  Car,
  CheckCircle2,
  AlertTriangle,
  Mail,
  Edit2,
  Check,
  X,
  Plus,
  Fuel,
  Wrench,
  FileText,
  History,
  TrendingUp,
  Calendar,
  ChevronDown,
  ChevronLeft,
  RefreshCw,
} from '../components/Icons';

export const DashboardScreen: React.FC = () => {
  const { spreadsheetId, user, strings, isRTL, theme } = useApp();
  const isDark = theme === 'dark';

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Name Edit State
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const [isSavingName, setIsSavingName] = useState(false);

  // Mileage Edit State
  const [isEditingMileage, setIsEditingMileage] = useState(false);
  const [newMileage, setNewMileage] = useState('');
  const [isSavingMileage, setIsSavingMileage] = useState(false);

  // Email Report Sending
  const [isSendingReport, setIsSendingReport] = useState(false);

  // Modals & Quick Menu State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MaintenanceRecord | null>(null);
  const [editingRecordIndex, setEditingRecordIndex] = useState<number | undefined>(undefined);

  const [isQuickLogOpen, setIsQuickLogOpen] = useState(false);
  const [quickLogType, setQuickLogType] = useState<'fuel' | 'emergency'>('fuel');
  const [isFabMenuOpen, setIsFabMenuOpen] = useState(false);

  // Collapsed Groups in History
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  const toggleGroup = (groupName: string) => {
    setCollapsedGroups(prev => {
      const next = new Set(prev);
      if (next.has(groupName)) {
        next.delete(groupName);
      } else {
        next.add(groupName);
      }
      return next;
    });
  };

  const loadData = async () => {
    if (!spreadsheetId) return;
    setError(null);
    try {
      const res = await loadVehicleData(spreadsheetId);
      setData(res);
    } catch (err: any) {
      console.error('Error loading vehicle data:', err);
      setError(err.message || strings.errorLoadingData);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    loadData();
  }, [spreadsheetId]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  // Stats Calculations
  const totalCost = data?.records.reduce((acc, curr) => acc + (curr.cost || 0), 0) || 0;

  const upcomingMaintenance = data?.records.filter(r => {
    if (r.maxMileageForChange === 0) return false;
    const remaining = r.maxMileageForChange - (data.vehicle.currentMileage || 0);
    return remaining > 0 && remaining < 1000;
  }) || [];

  const overdueMaintenance = data?.records.filter(r => {
    if (r.maxMileageForChange === 0) return false;
    const remaining = r.maxMileageForChange - (data.vehicle.currentMileage || 0);
    return remaining <= 0;
  }) || [];

  // Save Vehicle Name
  const handleSaveName = async () => {
    const trimmed = newName.trim();
    if (trimmed) {
      setIsSavingName(true);
      try {
        await updateVehicleName(spreadsheetId, 'Sheet1', trimmed);
        await loadData();
        setIsEditingName(false);
      } catch {
        Alert.alert(isRTL ? 'خطأ' : 'Error', 'Failed to update vehicle name');
      } finally {
        setIsSavingName(false);
      }
    }
  };

  // Save Vehicle Mileage
  const handleSaveMileage = async () => {
    const parsed = Number(newMileage);
    if (!isNaN(parsed) && parsed > 0) {
      setIsSavingMileage(true);
      try {
        await updateCurrentMileage(spreadsheetId, 'Sheet1', parsed);
        await loadData();
        setIsEditingMileage(false);
      } catch {
        Alert.alert(isRTL ? 'خطأ' : 'Error', 'Failed to update mileage');
      } finally {
        setIsSavingMileage(false);
      }
    }
  };

  // Send Email Report
  const handleSendReport = async () => {
    if (!user?.email) {
      Alert.alert(isRTL ? 'تنبيه' : 'Alert', 'User email not found');
      return;
    }

    setIsSendingReport(true);
    try {
      let htmlBody = `<div dir="${isRTL ? 'rtl' : 'ltr'}" style="font-family: Arial, sans-serif; line-height: 1.6;">`;
      htmlBody += `<h2>Maintenance Report: ${data?.vehicle.name || strings.vehicleName}</h2>`;
      htmlBody += `<p>${strings.currentMileage}: <strong>${data?.vehicle.currentMileage?.toLocaleString()} ${strings.km}</strong></p>`;

      if (overdueMaintenance.length > 0) {
        htmlBody += `<h3 style="color: #dc2626;">🔴 ${strings.overdue}:</h3><ul>`;
        overdueMaintenance.forEach(m => {
          htmlBody += `<li>${m.name} (${m.maxMileageForChange?.toLocaleString()} ${strings.km})</li>`;
        });
        htmlBody += `</ul>`;
      }

      if (upcomingMaintenance.length > 0) {
        htmlBody += `<h3 style="color: #d97706;">🟡 ${strings.upcoming}:</h3><ul>`;
        upcomingMaintenance.forEach(m => {
          htmlBody += `<li>${m.name} (${m.maxMileageForChange?.toLocaleString()} ${strings.km})</li>`;
        });
        htmlBody += `</ul>`;
      }

      if (overdueMaintenance.length === 0 && upcomingMaintenance.length === 0) {
        htmlBody += `<p style="color: #16a34a;">✅ ${strings.statusGood}</p>`;
      }

      htmlBody += `</div>`;

      await sendEmail(
        user.email,
        `📊 Report: ${data?.vehicle.name || strings.vehicleName}`,
        htmlBody
      );
      Alert.alert(isRTL ? 'نجاح' : 'Success', 'Report sent successfully!');
    } catch (e) {
      console.error(e);
      Alert.alert(isRTL ? 'خطأ' : 'Error', 'Failed to send report.');
    } finally {
      setIsSendingReport(false);
    }
  };

  // Grouping Records by Month / Year
  const groupedRecords = React.useMemo(() => {
    if (!data?.records) return [];
    const withIndex = data.records.map((r, i) => ({ ...r, originalIndex: i }));

    withIndex.sort((a, b) => {
      const da = new Date(a.lastMaintenanceDate || 0).getTime();
      const db = new Date(b.lastMaintenanceDate || 0).getTime();
      return db - da;
    });

    const groups: { groupName: string; items: typeof withIndex }[] = [];

    withIndex.forEach(record => {
      let groupKey = isRTL ? 'بدون تاريخ' : 'No Date';
      if (record.lastMaintenanceDate) {
        const d = new Date(record.lastMaintenanceDate);
        if (!isNaN(d.getTime())) {
          groupKey = d.toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', {
            month: 'long',
            year: 'numeric',
          });
        }
      }

      let group = groups.find(g => g.groupName === groupKey);
      if (!group) {
        group = { groupName: groupKey, items: [] };
        groups.push(group);
      }
      group.items.push(record);
    });

    return groups;
  }, [data?.records, isRTL]);

  if (loading && !refreshing) {
    return (
      <View style={[styles.centerContainer, isDark && styles.darkContainer]}>
        <ActivityIndicator size="large" color="#059669" />
        <Text style={[styles.loadingText, isDark && styles.darkSubtext]}>{strings.loading}</Text>
      </View>
    );
  }

  if (error && !data) {
    return (
      <View style={[styles.centerContainer, isDark && styles.darkContainer]}>
        <View style={styles.errorBox}>
          <AlertTriangle color="#ef4444" size={36} />
          <Text style={styles.errorTitle}>{strings.errorLoadingData}</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity onPress={loadData} style={styles.retryBtn}>
            <RefreshCw color="#ffffff" size={16} />
            <Text style={styles.retryBtnText}>{strings.retry}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, isDark && styles.darkContainer]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#059669" />}
      >
        {/* 1. Vehicle Info Card */}
        <View style={[styles.card, isDark && styles.darkCard]}>
          <View style={[styles.cardHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 8 }}>
              <Car color="#059669" size={20} />
              <Text style={[styles.cardTitle, isDark && styles.darkText]}>{strings.vehicleInfo}</Text>
            </View>
            <View style={[styles.syncBadge, isDark && styles.darkSyncBadge]}>
              <CheckCircle2 color="#059669" size={12} />
              <Text style={styles.syncBadgeText}>{strings.syncWithSheets}</Text>
            </View>
          </View>

          <View style={[styles.gridTwoCols, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            {/* Vehicle Name Box */}
            <View style={[styles.infoBox, isDark && styles.darkInfoBox]}>
              <Text style={[styles.infoLabel, isDark && styles.darkSubtext, { textAlign: isRTL ? 'right' : 'left' }]}>
                {strings.vehicleName}
              </Text>
              {isEditingName ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                  <TextInput
                    value={newName}
                    onChangeText={setNewName}
                    style={[styles.inlineInput, isDark && styles.darkInput]}
                    autoFocus
                  />
                  <TouchableOpacity onPress={handleSaveName} style={styles.iconBtnEmerald} disabled={isSavingName}>
                    <Check color="#ffffff" size={14} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setIsEditingName(false)} style={styles.iconBtnGray}>
                    <X color="#64748b" size={14} />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={[styles.valueRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                  <Text style={[styles.infoValue, isDark && styles.darkText]} numberOfLines={1}>
                    {data?.vehicle.name || strings.vehicleName}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setNewName(data?.vehicle.name || strings.vehicleName);
                      setIsEditingName(true);
                    }}
                    style={[styles.smallEditBtn, isDark && styles.darkSmallEditBtn]}
                  >
                    <Edit2 color={isDark ? '#94a3b8' : '#64748b'} size={12} />
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Current Mileage Box */}
            <View style={[styles.infoBox, isDark && styles.darkInfoBox]}>
              <Text style={[styles.infoLabel, isDark && styles.darkSubtext, { textAlign: isRTL ? 'right' : 'left' }]}>
                {strings.currentMileage}
              </Text>
              {isEditingMileage ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                  <TextInput
                    value={newMileage}
                    onChangeText={setNewMileage}
                    keyboardType="numeric"
                    style={[styles.inlineInput, isDark && styles.darkInput]}
                    autoFocus
                  />
                  <TouchableOpacity onPress={handleSaveMileage} style={styles.iconBtnEmerald} disabled={isSavingMileage}>
                    <Check color="#ffffff" size={14} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setIsEditingMileage(false)} style={styles.iconBtnGray}>
                    <X color="#64748b" size={14} />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={[styles.valueRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                  <Text style={[styles.infoValue, isDark && styles.darkText]}>
                    {data?.vehicle.currentMileage?.toLocaleString()}{' '}
                    <Text style={styles.unitText}>{strings.km}</Text>
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setNewMileage(data?.vehicle.currentMileage?.toString() || '');
                      setIsEditingMileage(true);
                    }}
                    style={[styles.smallEditBtn, isDark && styles.darkSmallEditBtn]}
                  >
                    <Edit2 color={isDark ? '#94a3b8' : '#64748b'} size={12} />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* 2. Health & Alerts Bento Card */}
        <View style={[styles.card, isDark && styles.darkCard]}>
          <View style={[styles.cardHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <View style={{ flexDirection: 'row', gap: 6 }}>
              {overdueMaintenance.length > 0 ? (
                <View style={[styles.alertPill, { backgroundColor: '#fee2e2' }]}>
                  <AlertTriangle color="#ef4444" size={12} />
                  <Text style={[styles.alertPillText, { color: '#ef4444' }]}>
                    {overdueMaintenance.length} {strings.overdue}
                  </Text>
                </View>
              ) : upcomingMaintenance.length > 0 ? (
                <View style={[styles.alertPill, { backgroundColor: '#fef3c7' }]}>
                  <AlertTriangle color="#d97706" size={12} />
                  <Text style={[styles.alertPillText, { color: '#d97706' }]}>
                    {upcomingMaintenance.length} {strings.upcoming}
                  </Text>
                </View>
              ) : (
                <View style={[styles.alertPill, { backgroundColor: '#d1fae5' }]}>
                  <CheckCircle2 color="#059669" size={12} />
                  <Text style={[styles.alertPillText, { color: '#059669' }]}>{strings.good}</Text>
                </View>
              )}
            </View>

            <TouchableOpacity
              onPress={handleSendReport}
              disabled={isSendingReport}
              style={[styles.sendReportBtn, isDark && styles.darkBtnBorder]}
            >
              {isSendingReport ? (
                <ActivityIndicator size="small" color="#059669" />
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Mail color={isDark ? '#94a3b8' : '#64748b'} size={14} />
                  <Text style={[styles.sendReportText, isDark && styles.darkText]}>{strings.sendReport}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {(upcomingMaintenance.length > 0 || overdueMaintenance.length > 0) && (
            <View style={{ marginVertical: 4 }}>
              <Text style={[styles.nextMaintenanceLabel, isDark && styles.darkSubtext, { textAlign: isRTL ? 'right' : 'left' }]}>
                {strings.nextMaintenance}
              </Text>
              <Text style={[styles.nextMaintenanceValue, { textAlign: isRTL ? 'right' : 'left' }]}>
                {Math.min(
                  ...[...overdueMaintenance, ...upcomingMaintenance].map(m => m.maxMileageForChange)
                ).toLocaleString()}{' '}
                <Text style={styles.unitText}>{strings.km}</Text>
              </Text>
            </View>
          )}

          {/* Progress Bars for Systems */}
          <View style={[styles.healthGrid, isDark && styles.darkInfoBox, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={[styles.systemLabel, isDark && styles.darkSubtext]}>{strings.engine}</Text>
              <View style={[styles.progressBarTrack, isDark && styles.darkProgressBarTrack]}>
                <View style={[styles.progressBarFill, { width: '100%', backgroundColor: '#059669' }]} />
              </View>
              <Text style={[styles.systemStatusText, isDark && styles.darkSubtext]}>{strings.statusGood}</Text>
            </View>

            <View style={{ flex: 1, gap: 4 }}>
              <Text style={[styles.systemLabel, isDark && styles.darkSubtext]}>{strings.oil}</Text>
              <View style={[styles.progressBarTrack, isDark && styles.darkProgressBarTrack]}>
                <View style={[styles.progressBarFill, { width: '75%', backgroundColor: '#d97706' }]} />
              </View>
              <Text style={[styles.systemStatusText, isDark && styles.darkSubtext]}>{strings.statusAvg}</Text>
            </View>
          </View>
        </View>

        {/* 3. Reminders Section */}
        <RemindersSection
          upcomingMaintenance={upcomingMaintenance}
          overdueMaintenance={overdueMaintenance}
          currentMileage={data?.vehicle.currentMileage || 0}
        />

        {/* 4. Total Spending Box */}
        <View style={styles.spendingGradientCard}>
          <View style={[styles.cardHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Text style={styles.spendingCardLabel}>{strings.totalSpending}</Text>
            <View style={styles.chartIconBadge}>
              <TrendingUp color="#ffffff" size={16} />
            </View>
          </View>

          <View style={{ marginTop: 14 }}>
            <Text style={styles.spendingAmount}>
              {totalCost.toLocaleString()}{' '}
              <Text style={styles.spendingCurrency}>{strings.currency}</Text>
            </Text>
            <Text style={styles.spendingSubtext}>{strings.basedOnInvoices}</Text>
          </View>
        </View>

        {/* 5. Spending Chart Box */}
        <View style={[styles.card, isDark && styles.darkCard]}>
          <Text style={[styles.cardTitle, isDark && styles.darkText, { textAlign: isRTL ? 'right' : 'left' }]}>
            {strings.costReport}
          </Text>
          {data && <SpendingChart records={data.records} />}
        </View>

        {/* 6. Maintenance History Grouped List */}
        <View style={[styles.card, isDark && styles.darkCard]}>
          <View style={[styles.cardHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 8 }}>
              <History color="#059669" size={20} />
              <Text style={[styles.cardTitle, isDark && styles.darkText]}>{strings.maintenanceHistory}</Text>
            </View>
          </View>

          <View style={{ gap: 8 }}>
            {groupedRecords.map(group => {
              const isCollapsed = collapsedGroups.has(group.groupName);
              return (
                <View key={group.groupName} style={{ gap: 6 }}>
                  {/* Group Header Button */}
                  <TouchableOpacity
                    onPress={() => toggleGroup(group.groupName)}
                    style={[styles.groupHeaderBtn, isDark && styles.darkGroupHeaderBtn, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
                  >
                    <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 8 }}>
                      <Calendar color="#059669" size={16} />
                      <Text style={[styles.groupHeaderText, isDark && styles.darkText]}>{group.groupName}</Text>
                      <View style={[styles.countBadge, isDark && styles.darkCountBadge]}>
                        <Text style={[styles.countBadgeText, isDark && styles.darkSubtext]}>{group.items.length}</Text>
                      </View>
                    </View>
                    {isCollapsed ? (
                      <ChevronLeft color={isDark ? '#94a3b8' : '#64748b'} size={16} />
                    ) : (
                      <ChevronDown color={isDark ? '#94a3b8' : '#64748b'} size={16} />
                    )}
                  </TouchableOpacity>

                  {/* Group Records */}
                  {!isCollapsed && (
                    <View style={{ gap: 6 }}>
                      {group.items.map(record => (
                        <MaintenanceCard
                          key={record.id}
                          record={record}
                          currentMileage={data?.vehicle.currentMileage || 0}
                          onEdit={r => {
                            setEditingRecord(r);
                            setEditingRecordIndex(record.originalIndex);
                            setIsAddModalOpen(true);
                          }}
                        />
                      ))}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </View>

        {/* 7. Sync Status Box */}
        <View style={[styles.syncStatusCard, isDark && styles.darkSyncStatusCard]}>
          <View style={[styles.cardHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Text style={styles.syncStatusTitle}>{strings.syncStatus}</Text>
            <View style={styles.securedBadge}>
              <Text style={styles.securedText}>{strings.secured}</Text>
            </View>
          </View>

          <View style={{ gap: 8, marginTop: 8 }}>
            <View style={[styles.syncStatusRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Text style={styles.syncStatusLabel}>Google Drive</Text>
              <Text style={styles.syncStatusActive}>{strings.connected}</Text>
            </View>
            <View style={[styles.syncStatusRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Text style={styles.syncStatusLabel}>Gmail Reminders</Text>
              <Text style={styles.syncStatusActive}>{strings.active}</Text>
            </View>
            <View style={[styles.syncStatusRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Text style={styles.syncStatusLabel}>Google Calendar</Text>
              <Text style={styles.syncStatusActive}>{strings.active}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* FAB (Floating Action Button) & Quick Menu */}
      <View style={[styles.fabContainer, { [isRTL ? 'left' : 'right']: 20 }]}>
        {isFabMenuOpen && (
          <View style={[styles.fabMenu, { alignItems: isRTL ? 'flex-start' : 'flex-end' }]}>
            {/* Full Record */}
            <TouchableOpacity
              onPress={() => {
                setIsFabMenuOpen(false);
                setEditingRecord(null);
                setEditingRecordIndex(undefined);
                setIsAddModalOpen(true);
              }}
              style={[styles.fabMenuItem, isDark && styles.darkFabMenuItem, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
            >
              <Text style={[styles.fabMenuText, isDark && styles.darkText]}>{strings.addMaintenance}</Text>
              <View style={[styles.fabMenuIcon, { backgroundColor: '#ecfdf5' }]}>
                <FileText color="#059669" size={16} />
              </View>
            </TouchableOpacity>

            {/* Emergency Fix */}
            <TouchableOpacity
              onPress={() => {
                setIsFabMenuOpen(false);
                setQuickLogType('emergency');
                setIsQuickLogOpen(true);
              }}
              style={[styles.fabMenuItem, isDark && styles.darkFabMenuItem, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
            >
              <Text style={[styles.fabMenuText, isDark && styles.darkText]}>{strings.emergencyFix}</Text>
              <View style={[styles.fabMenuIcon, { backgroundColor: '#fee2e2' }]}>
                <Wrench color="#ef4444" size={16} />
              </View>
            </TouchableOpacity>

            {/* Quick Fuel */}
            <TouchableOpacity
              onPress={() => {
                setIsFabMenuOpen(false);
                setQuickLogType('fuel');
                setIsQuickLogOpen(true);
              }}
              style={[styles.fabMenuItem, isDark && styles.darkFabMenuItem, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
            >
              <Text style={[styles.fabMenuText, isDark && styles.darkText]}>{strings.fuelFill}</Text>
              <View style={[styles.fabMenuIcon, { backgroundColor: '#fef3c7' }]}>
                <Fuel color="#d97706" size={16} />
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Main Floating Button */}
        <TouchableOpacity
          onPress={() => setIsFabMenuOpen(!isFabMenuOpen)}
          style={[styles.mainFab, isFabMenuOpen && styles.mainFabActive]}
        >
          <Plus
            color="#ffffff"
            size={24}
            style={{ transform: [{ rotate: isFabMenuOpen ? '45deg' : '0deg' }] }}
          />
        </TouchableOpacity>
      </View>

      {/* Add / Edit Maintenance Modal */}
      <AddMaintenanceModal
        visible={isAddModalOpen}
        editRecord={editingRecord}
        editIndex={editingRecordIndex}
        initialMileage={data?.vehicle.currentMileage || 0}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingRecord(null);
          setEditingRecordIndex(undefined);
        }}
        onSuccess={loadData}
      />

      {/* Quick Log Modal */}
      <QuickLogModal
        visible={isQuickLogOpen}
        type={quickLogType}
        currentMileage={data?.vehicle.currentMileage || 0}
        onClose={() => setIsQuickLogOpen(false)}
        onSuccess={loadData}
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
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748b',
  },
  errorBox: {
    alignItems: 'center',
    gap: 10,
    padding: 24,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ef4444',
  },
  errorMessage: {
    fontSize: 13,
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
    borderRadius: 12,
    marginTop: 8,
  },
  retryBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13,
  },
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
  cardHeader: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  syncBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  darkSyncBadge: {
    backgroundColor: '#064e3b33',
  },
  syncBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#059669',
  },
  gridTwoCols: {
    gap: 10,
  },
  infoBox: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  darkInfoBox: {
    backgroundColor: '#131b2e',
    borderColor: '#1e293b',
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
  },
  valueRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    flex: 1,
  },
  unitText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94a3b8',
  },
  smallEditBtn: {
    padding: 6,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  darkSmallEditBtn: {
    backgroundColor: '#1f2937',
    borderColor: '#374151',
  },
  inlineInput: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#059669',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  darkInput: {
    backgroundColor: '#131b2e',
    borderColor: '#059669',
    color: '#f8fafc',
  },
  iconBtnEmerald: {
    backgroundColor: '#059669',
    padding: 6,
    borderRadius: 8,
  },
  iconBtnGray: {
    backgroundColor: '#e2e8f0',
    padding: 6,
    borderRadius: 8,
  },
  alertPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  alertPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  sendReportBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
  },
  darkBtnBorder: {
    backgroundColor: '#1f2937',
    borderColor: '#374151',
  },
  sendReportText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  nextMaintenanceLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
  },
  nextMaintenanceValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#059669',
    marginTop: 2,
  },
  healthGrid: {
    padding: 12,
    borderRadius: 16,
    backgroundColor: '#f8fafc',
    gap: 12,
  },
  systemLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
  },
  progressBarTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#e2e8f0',
    overflow: 'hidden',
  },
  darkProgressBarTrack: {
    backgroundColor: '#1e293b',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  systemStatusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748b',
  },
  spendingGradientCard: {
    backgroundColor: '#065f46',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#065f46',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  spendingCardLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#a7f3d0',
  },
  chartIconBadge: {
    padding: 6,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  spendingAmount: {
    fontSize: 28,
    fontWeight: '900',
    color: '#ffffff',
  },
  spendingCurrency: {
    fontSize: 18,
    fontWeight: '600',
    color: '#a7f3d0',
  },
  spendingSubtext: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 2,
  },
  groupHeaderBtn: {
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  darkGroupHeaderBtn: {
    backgroundColor: '#131b2e',
    borderColor: '#1e293b',
  },
  groupHeaderText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  countBadge: {
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  darkCountBadge: {
    backgroundColor: '#1e293b',
  },
  countBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748b',
  },
  syncStatusCard: {
    backgroundColor: '#0f172a',
    borderRadius: 24,
    padding: 18,
    gap: 8,
  },
  darkSyncStatusCard: {
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  syncStatusTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  securedBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  securedText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#34d399',
  },
  syncStatusRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 10,
    borderRadius: 12,
  },
  syncStatusLabel: {
    fontSize: 12,
    color: '#94a3b8',
  },
  syncStatusActive: {
    fontSize: 12,
    fontWeight: '700',
    color: '#34d399',
  },
  fabContainer: {
    position: 'absolute',
    bottom: 24,
    alignItems: 'center',
    gap: 12,
  },
  fabMenu: {
    gap: 10,
    marginBottom: 6,
  },
  fabMenuItem: {
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  darkFabMenuItem: {
    backgroundColor: '#1e293b',
  },
  fabMenuText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  fabMenuIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainFab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  mainFabActive: {
    backgroundColor: '#1e293b',
  },
  darkText: {
    color: '#f8fafc',
  },
  darkSubtext: {
    color: '#94a3b8',
  },
});
