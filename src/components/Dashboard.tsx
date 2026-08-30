import React, { useState, useEffect } from 'react';
import { loadVehicleData, updateCurrentMileage, updateVehicleName, addMaintenanceRecord } from '../lib/parser';
import { DashboardData, MaintenanceRecord } from '../types';
import { AlertTriangle, Plus, BarChart2, CheckCircle2, History, TrendingUp, Settings, Edit2, Check, X, Loader2, Mail, Fuel, Wrench, FileText, Car } from 'lucide-react';
import { sendEmail } from '../lib/googleApi';
import { MaintenanceTable } from './MaintenanceTable';
import { SpendingChart } from './SpendingChart';
import { AddMaintenanceForm } from './AddMaintenanceForm';
import { Reminders } from './Reminders';
import { t, Language } from '../locales';

interface Props {
  spreadsheetId: string;
  userEmail: string;
  lang: Language;
}

export function Dashboard({ spreadsheetId, userEmail, lang }: Props) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mileage Edit State
  const [isEditingMileage, setIsEditingMileage] = useState(false);
  const [newMileage, setNewMileage] = useState('');
  const [isSavingMileage, setIsSavingMileage] = useState(false);

  // Vehicle Name Edit State
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const [isSavingName, setIsSavingName] = useState(false);

  // Quick Log State
  const [isQuickLogMenuOpen, setIsQuickLogMenuOpen] = useState(false);
  const [isQuickLogModalOpen, setIsQuickLogModalOpen] = useState(false);
  const [quickLogType, setQuickLogType] = useState<'fuel' | 'emergency' | 'full'>('fuel');
  const [quickCost, setQuickCost] = useState('');
  const [quickNote, setQuickNote] = useState('');
  const [quickMileage, setQuickMileage] = useState('');
  const [isQuickLogSaving, setIsQuickLogSaving] = useState(false);


  // Stats
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

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await loadVehicleData(spreadsheetId);
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Failed to load data from the spreadsheet.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [spreadsheetId]);

  const handleSaveMileage = async () => {
    const parsed = Number(newMileage);
    if (!isNaN(parsed) && parsed > 0) {
      setIsSavingMileage(true);
      try {
        await updateCurrentMileage(spreadsheetId, 'Sheet1', parsed);
        await loadData();
        setIsEditingMileage(false);
      } catch (e) {
        alert('Failed to update mileage');
      } finally {
        setIsSavingMileage(false);
      }
    }
  };

  const handleCancelMileageEdit = () => {
    setIsEditingMileage(false);
    setNewMileage('');
  };

  const handleStartMileageEdit = () => {
    setNewMileage(data?.vehicle.currentMileage?.toString() || '');
    setIsEditingMileage(true);
  };

  const [isSendingReport, setIsSendingReport] = useState(false);

  const handleSendReport = async () => {
    setIsSendingReport(true);
    try {
      const upcoming = upcomingMaintenance.map(o => o.name).join(', ') || 'None';
      const overdue = overdueMaintenance.map(o => o.name).join(', ') || 'None';
      
      let htmlBody = `<div dir="${lang === 'ar' ? 'rtl' : 'ltr'}" style="font-family: Arial, sans-serif; line-height: 1.6;">`;
      htmlBody += `<h2>Maintenance Report: ${data?.vehicle.name || t[lang].vehicleName}</h2>`;
      htmlBody += `<p>${t[lang].currentMileage}: <strong>${data?.vehicle.currentMileage?.toLocaleString()} ${t[lang].km}</strong></p>`;
      
      if (overdueMaintenance.length > 0) {
        htmlBody += `<h3 style="color: #dc2626;">🔴 ${t[lang].overdue}:</h3><ul>`;
        overdueMaintenance.forEach(m => {
          htmlBody += `<li>${m.name} (${m.maxMileageForChange?.toLocaleString()} ${t[lang].km})</li>`;
        });
        htmlBody += `</ul>`;
      }
      
      if (upcomingMaintenance.length > 0) {
        htmlBody += `<h3 style="color: #d97706;">🟡 ${t[lang].upcoming}:</h3><ul>`;
        upcomingMaintenance.forEach(m => {
          htmlBody += `<li>${m.name} (${m.maxMileageForChange?.toLocaleString()} ${t[lang].km})</li>`;
        });
        htmlBody += `</ul>`;
      }

      if (overdueMaintenance.length === 0 && upcomingMaintenance.length === 0) {
        htmlBody += `<p style="color: #16a34a;">✅ ${t[lang].statusGood}</p>`;
      }
      
      htmlBody += `</div>`;
      
      await sendEmail(
        userEmail, 
        `📊 Report: ${data?.vehicle.name || t[lang].vehicleName}`, 
        htmlBody
      );
      alert('Report sent successfully!');
    } catch (e) {
      console.error("Failed to send report", e);
      alert('Failed to send report.');
    } finally {
      setIsSendingReport(false);
    }
  };

  const handleSaveName = async () => {
    const trimmed = newName.trim();
    if (trimmed) {
      setIsSavingName(true);
      try {
        await updateVehicleName(spreadsheetId, 'Sheet1', trimmed);
        await loadData();
        setIsEditingName(false);
      } catch (e) {
        alert('Failed to update vehicle name');
      } finally {
        setIsSavingName(false);
      }
    }
  };

  const handleCancelNameEdit = () => {
    setIsEditingName(false);
    setNewName('');
  };

  const handleStartNameEdit = () => {
    setNewName(data?.vehicle.name || t[lang].vehicleName);
    setIsEditingName(true);
  };

  const openQuickLogModal = (type: 'fuel' | 'emergency' | 'full') => {
    setQuickLogType(type);
    setQuickCost('');
    setQuickNote('');
    setQuickMileage(data?.vehicle.currentMileage?.toString() || '');
    setIsQuickLogModalOpen(true);
    setIsQuickLogMenuOpen(false);
  };

  const handleQuickLogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickCost || !quickMileage) return;

    setIsQuickLogSaving(true);
    try {
      const today = new Date();
      const dateString = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
      
      const newRecord = {
        name: quickLogType === 'fuel' ? (lang === 'ar' ? 'تعبئة وقود' : 'Fuel') : (quickNote || (lang === 'ar' ? 'إصلاح طارئ' : 'Emergency Fix')),
        mileageAtMaintenance: parseInt(quickMileage),
        minMileageForChange: 0,
        maxMileageForChange: 0,
        lastMaintenanceDate: dateString,
        cost: parseFloat(quickCost),
        receiptLink: ''
      };

      await addMaintenanceRecord(spreadsheetId, 'Sheet1', newRecord);
      
      // Also update current mileage if it's higher
      if (parseInt(quickMileage) > (data?.vehicle.currentMileage || 0)) {
        await updateCurrentMileage(spreadsheetId, 'Sheet1', parseInt(quickMileage));
      }

      await loadData();
      setIsQuickLogModalOpen(false);
    } catch (e) {
      alert('Failed to log record');
    } finally {
      setIsQuickLogSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-pulse flex gap-2"><div className="w-3 h-3 bg-emerald-600 rounded-full"></div><div className="w-3 h-3 bg-emerald-600 rounded-full animation-delay-200"></div><div className="w-3 h-3 bg-emerald-600 rounded-full animation-delay-400"></div></div></div>;
  }

    if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-400 p-6 rounded-xl flex flex-col items-center justify-center text-center m-4">
        <AlertTriangle className="w-10 h-10 mb-4 text-red-500" />
        <h3 className="font-semibold text-lg mb-2">Error Loading Data</h3>
        <p>{error}</p>
        <button onClick={loadData} className="mt-4 px-4 py-2 bg-red-100 dark:bg-red-900/40 hover:bg-red-200 dark:hover:bg-red-900/60 rounded-lg font-medium transition-colors">Retry</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 h-full p-4">
      
      {/* 1. Dedicated Vehicle Info Card */}
      <div className="bg-white dark:bg-gray-900 rounded-[24px] border border-gray-100 dark:border-gray-800 shadow-sm p-5 flex flex-col gap-4 transition-colors">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 transition-colors">
            <Car className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
            {t[lang].vehicleInfo}
          </h3>
          <p className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-md transition-colors">
            <CheckCircle2 className="w-3 h-3" /> {t[lang].syncWithSheets}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Nickname */}
          <div className="flex flex-col bg-gray-50 dark:bg-gray-800 p-4 rounded-[20px] border border-gray-100 dark:border-gray-700 relative transition-colors">
             <span className="text-gray-500 dark:text-gray-400 text-[10px] font-bold uppercase tracking-wide mb-1.5 transition-colors">{t[lang].vehicleName}</span>
             {isEditingName ? (
               <div className="flex items-center gap-1.5 mt-1 w-full">
                 <input
                   type="text"
                   value={newName}
                   onChange={(e) => setNewName(e.target.value)}
                   className="flex-1 px-2 py-1.5 text-sm font-bold border-2 border-emerald-500 rounded-lg outline-none min-w-0 bg-white dark:bg-gray-900 dark:text-white transition-colors"
                   autoFocus
                 />
                 <button onClick={handleSaveName} disabled={isSavingName} className="text-white bg-emerald-600 hover:bg-emerald-700 p-1.5 rounded-lg transition-colors shadow-sm flex-shrink-0">
                   {isSavingName ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                 </button>
                 <button onClick={handleCancelNameEdit} disabled={isSavingName} className="text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 bg-gray-100 dark:bg-gray-700 p-1.5 rounded-lg transition-colors flex-shrink-0">
                   <X className="w-3.5 h-3.5" />
                 </button>
               </div>
             ) : (
               <div className="flex items-center justify-between mt-1">
                 <span className="font-black text-gray-900 dark:text-white truncate text-lg transition-colors">{data?.vehicle.name || t[lang].vehicleName}</span>
                 <button onClick={handleStartNameEdit} className="text-gray-400 dark:text-gray-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-1.5 rounded-full shadow-sm flex-shrink-0">
                   <Edit2 className="w-3.5 h-3.5" />
                 </button>
               </div>
             )}
          </div>

          {/* Mileage */}
          <div className="flex flex-col bg-gray-50 dark:bg-gray-800 p-4 rounded-[20px] border border-gray-100 dark:border-gray-700 relative transition-colors">
             <span className="text-gray-500 dark:text-gray-400 text-[10px] font-bold uppercase tracking-wide mb-1.5 transition-colors">{t[lang].currentMileage}</span>
             {isEditingMileage ? (
               <div className="flex items-center gap-1.5 mt-1 w-full">
                 <input
                   type="number"
                   value={newMileage}
                   onChange={(e) => setNewMileage(e.target.value)}
                   className="flex-1 px-2 py-1.5 text-sm font-bold border-2 border-emerald-500 rounded-lg outline-none min-w-0 bg-white dark:bg-gray-900 dark:text-white transition-colors"
                   autoFocus
                 />
                 <button onClick={handleSaveMileage} disabled={isSavingMileage} className="text-white bg-emerald-600 hover:bg-emerald-700 p-1.5 rounded-lg transition-colors shadow-sm flex-shrink-0">
                   {isSavingMileage ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                 </button>
                 <button onClick={handleCancelMileageEdit} disabled={isSavingMileage} className="text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 bg-gray-100 dark:bg-gray-700 p-1.5 rounded-lg transition-colors flex-shrink-0">
                   <X className="w-3.5 h-3.5" />
                 </button>
               </div>
             ) : (
               <div className="flex items-center justify-between mt-1">
                 <div className="flex items-baseline gap-1 truncate">
                   <span className="font-black text-gray-900 dark:text-white text-lg transition-colors">{data?.vehicle.currentMileage?.toLocaleString()}</span>
                   <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 transition-colors">{t[lang].km}</span>
                 </div>
                 <button onClick={handleStartMileageEdit} className="text-gray-400 dark:text-gray-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-1.5 rounded-full shadow-sm flex-shrink-0">
                   <Edit2 className="w-3.5 h-3.5" />
                 </button>
               </div>
             )}
          </div>
        </div>
      </div>

      {/* 1.5. Health & Alerts Card */}
      <div className="bg-white dark:bg-gray-900 rounded-[24px] border border-gray-100 dark:border-gray-800 shadow-sm p-5 flex flex-col gap-4 transition-colors">
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            {overdueMaintenance.length > 0 ? (
               <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-3 py-1.5 rounded-full text-xs font-bold border border-red-200 dark:border-red-800/50 flex items-center gap-1.5 shadow-sm transition-colors">
                  <AlertTriangle className="w-3.5 h-3.5" /> {overdueMaintenance.length} {t[lang].overdue}
               </div>
            ) : upcomingMaintenance.length > 0 ? (
               <div className="bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-3 py-1.5 rounded-full text-xs font-bold border border-amber-200 dark:border-amber-800/50 flex items-center gap-1.5 shadow-sm transition-colors">
                  <AlertTriangle className="w-3.5 h-3.5" /> {upcomingMaintenance.length} {t[lang].upcoming}
               </div>
            ) : (
               <div className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-full text-xs font-bold border border-emerald-200 dark:border-emerald-800/50 flex items-center gap-1.5 shadow-sm transition-colors">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {t[lang].good}
               </div>
            )}
          </div>
          <button 
            onClick={handleSendReport} 
            disabled={isSendingReport}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-1.5 rounded-full transition-colors border border-gray-200 dark:border-gray-700 shadow-sm"
          >
            {isSendingReport ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Mail className="w-3.5 h-3.5" />}
            {t[lang].sendReport}
          </button>
        </div>

        {(upcomingMaintenance.length > 0 || overdueMaintenance.length > 0) && (
           <div className="flex flex-col px-2">
              <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wide mb-1 transition-colors">{t[lang].nextMaintenance}</p>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 flex items-baseline tracking-tight transition-colors">
                {Math.min(...[...overdueMaintenance, ...upcomingMaintenance].map(m => m.maxMileageForChange)).toLocaleString()}
                <span className="text-sm font-semibold text-gray-400 dark:text-gray-500 mx-1 transition-colors">{t[lang].km}</span>
              </p>
           </div>
        )}

        {/* Nested Bento for Health Status */}
        <div className="flex gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-[16px] border border-gray-100 dark:border-gray-700 transition-colors">
          <div className="flex-1 flex flex-col">
            <span className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase mb-1.5 transition-colors">{t[lang].engine}</span>
            <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden transition-colors">
               <div className="bg-emerald-500 dark:bg-emerald-400 h-full w-full transition-colors"></div>
            </div>
            <span className="text-[10px] text-gray-600 dark:text-gray-400 mt-1.5 font-medium transition-colors">{t[lang].statusGood}</span>
          </div>
          <div className="flex-1 flex flex-col">
            <span className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase mb-1.5 transition-colors">{t[lang].oil}</span>
            <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden transition-colors">
               <div className="bg-amber-500 dark:bg-amber-400 h-full w-3/4 transition-colors"></div>
            </div>
            <span className="text-[10px] text-gray-600 dark:text-gray-400 mt-1.5 font-medium transition-colors">{t[lang].statusAvg}</span>
          </div>
        </div>
      </div>

      {/* 2. Reminders Component */}
      <Reminders 
        upcomingMaintenance={upcomingMaintenance} 
        overdueMaintenance={overdueMaintenance} 
        currentMileage={data?.vehicle.currentMileage || 0}
        userEmail={userEmail}
        lang={lang} 
      />

      {/* 3. Total Spending Box */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-800 rounded-[24px] p-6 text-white flex flex-col justify-between shadow-lg shadow-emerald-900/20">
        <div className="flex justify-between items-center">
          <span className="text-emerald-100 font-medium text-sm">{t[lang].totalSpending}</span>
          <span className="bg-white/20 p-2 rounded-xl flex items-center justify-center backdrop-blur-sm"><BarChart2 className="w-5 h-5" /></span>
        </div>
        <div className="mt-6">
          <h3 className="text-3xl font-bold flex items-baseline gap-1.5 tracking-tight">
            {totalCost.toLocaleString()} 
            <span className="text-xl font-normal text-emerald-200">{t[lang].currency}</span>
          </h3>
          <p className="text-emerald-200/80 text-xs mt-1">{t[lang].basedOnInvoices}</p>
        </div>
      </div>

      {/* 3. Maintenance Table */}
      <div className="bg-white dark:bg-gray-900 rounded-[24px] border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col overflow-hidden min-h-[300px] transition-colors">
        <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2 transition-colors">
          <div className="bg-gray-100 dark:bg-gray-800 p-1.5 rounded-lg transition-colors">
            <History className="w-5 h-5 text-gray-600 dark:text-gray-400 transition-colors" />
          </div>
          <h3 className="font-bold text-gray-900 dark:text-white transition-colors">{t[lang].maintenanceHistory}</h3>
        </div>
        <div className="flex-1 w-full max-w-[100vw] overflow-x-auto">
          {data && <MaintenanceTable spreadsheetId={spreadsheetId} records={data.records} currentMileage={data.vehicle.currentMileage} onRefresh={loadData} lang={lang} />}
        </div>
      </div>

      {/* 5. Spending Chart Box */}
      <div className="bg-white dark:bg-gray-900 rounded-[24px] border border-gray-100 dark:border-gray-800 shadow-sm p-5 flex flex-col min-h-[300px] transition-colors">
        <h3 className="font-bold mb-4 text-gray-900 dark:text-white transition-colors">{t[lang].costReport}</h3>
        <div className="flex-1 flex flex-col justify-end">
          {data && <SpendingChart records={data.records} lang={lang} />}
        </div>
      </div>

      {/* 6. Sync Settings Box */}
      <div className="bg-gray-900 rounded-[24px] p-5 text-white flex flex-col shadow-lg shadow-gray-900/20">
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-bold">{t[lang].syncStatus}</h3>
          <span className="text-emerald-400 text-[10px] font-bold bg-emerald-400/10 px-2.5 py-1 rounded-md">{t[lang].secured}</span>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between bg-gray-800/50 p-3 rounded-[14px] border border-gray-700/50">
            <span className="text-xs text-gray-300 flex items-center gap-2"><Settings className="w-4 h-4 text-gray-400"/> Google Drive</span>
            <span className="text-xs font-bold text-emerald-400">{t[lang].connected}</span>
          </div>
          <div className="flex items-center justify-between bg-gray-800/50 p-3 rounded-[14px] border border-gray-700/50">
            <span className="text-xs text-gray-300 flex items-center gap-2"><Settings className="w-4 h-4 text-gray-400"/> Gmail Reminders</span>
            <span className="text-xs font-bold text-emerald-400">{t[lang].active}</span>
          </div>
          <div className="flex items-center justify-between bg-gray-800/50 p-3 rounded-[14px] border border-gray-700/50">
            <span className="text-xs text-gray-300 flex items-center gap-2"><Settings className="w-4 h-4 text-gray-400"/> Google Calendar</span>
            <span className="text-xs font-bold text-emerald-400">{t[lang].active}</span>
          </div>
        </div>
        <div className="mt-4 p-4 bg-white/5 rounded-[16px] border border-white/10 text-center">
           <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">{t[lang].autoUpdate}</p>
           <p className="text-sm font-medium">Sheets & Drive</p>
        </div>
      </div>

      {/* FAB Quick Menu */}
      <div className="fixed bottom-24 right-4 flex flex-col items-end gap-3 z-50">
        {isQuickLogMenuOpen && (
          <div className="flex flex-col gap-2 mb-2">
            <button 
              onClick={() => openQuickLogModal('full')}
              className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-full shadow-lg shadow-gray-200/50 border border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <span className="font-semibold text-gray-700 text-sm">{t[lang].addMaintenance}</span>
              <div className="bg-emerald-100 text-emerald-600 p-2 rounded-full">
                <FileText className="w-4 h-4" />
              </div>
            </button>
            <button 
              onClick={() => openQuickLogModal('emergency')}
              className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-full shadow-lg shadow-gray-200/50 border border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <span className="font-semibold text-gray-700 text-sm">{t[lang].emergencyFix}</span>
              <div className="bg-red-100 text-red-600 p-2 rounded-full">
                <Wrench className="w-4 h-4" />
              </div>
            </button>
            <button 
              onClick={() => openQuickLogModal('fuel')}
              className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-full shadow-lg shadow-gray-200/50 border border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <span className="font-semibold text-gray-700 text-sm">{t[lang].fuelFill}</span>
              <div className="bg-amber-100 text-amber-600 p-2 rounded-full">
                <Fuel className="w-4 h-4" />
              </div>
            </button>
          </div>
        )}
        <button 
          onClick={() => setIsQuickLogMenuOpen(!isQuickLogMenuOpen)}
          className={`w-14 h-14 rounded-full shadow-xl shadow-emerald-600/30 flex items-center justify-center transition-all ${isQuickLogMenuOpen ? 'bg-gray-800 text-white rotate-45' : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:scale-105'}`}
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Quick Log Modal */}
      {isQuickLogModalOpen && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          <div className="bg-white rounded-[24px] w-full max-w-sm overflow-hidden shadow-2xl shadow-gray-900/50 border border-white/20">
            <div className={`px-6 py-5 flex items-center justify-between ${quickLogType === 'fuel' ? 'bg-amber-500' : quickLogType === 'full' ? 'bg-emerald-600' : 'bg-red-500'} text-white`}>
              <div className="flex items-center gap-2 font-bold text-lg">
                {quickLogType === 'fuel' ? <Fuel className="w-5 h-5" /> : quickLogType === 'full' ? <FileText className="w-5 h-5" /> : <Wrench className="w-5 h-5" />}
                {quickLogType === 'fuel' ? t[lang].quickFuel : quickLogType === 'full' ? t[lang].addMaintenance : t[lang].quickEmergency}
              </div>
              <button onClick={() => setIsQuickLogModalOpen(false)} className="text-white/80 hover:text-white hover:bg-white/20 p-1.5 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {quickLogType === 'full' ? (
              <div className="p-6">
                <AddMaintenanceForm spreadsheetId={spreadsheetId} onRefresh={() => {
                  loadData();
                  setIsQuickLogModalOpen(false);
                }} lang={lang} />
              </div>
            ) : (
            <form onSubmit={handleQuickLogSubmit} className="p-6 flex flex-col gap-4">
              {quickLogType === 'emergency' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">{t[lang].descOrFix}</label>
                  <input
                    type="text"
                    required
                    value={quickNote}
                    onChange={(e) => setQuickNote(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-500 focus:bg-white transition-colors"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">{t[lang].cost} ({t[lang].currency})</label>
                <input
                  type="number"
                  required
                  min="0"
                  placeholder="0"
                  value={quickCost}
                  onChange={(e) => setQuickCost(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-500 focus:bg-white transition-colors font-semibold"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">{t[lang].currentMileage}</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={quickMileage}
                  onChange={(e) => setQuickMileage(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-500 focus:bg-white transition-colors font-semibold"
                />
              </div>
              
              <button
                type="submit"
                disabled={isQuickLogSaving}
                className={`mt-4 w-full py-3.5 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all ${quickLogType === 'fuel' ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/30' : 'bg-red-500 hover:bg-red-600 shadow-red-500/30'} shadow-lg ${isQuickLogSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isQuickLogSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                {t[lang].saveAndRecord}
              </button>
            </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
