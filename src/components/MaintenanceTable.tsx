import React, { useState, useMemo } from 'react';
import { MaintenanceRecord } from '../types';
import { FileText, Edit2, Check, X, Upload, Calendar, ChevronDown, ChevronLeft } from 'lucide-react';
import { addMaintenanceRecord } from '../lib/parser';
import { uploadReceipt } from '../lib/googleApi';
import { t, Language } from '../locales';

interface Props {
  spreadsheetId: string;
  records: MaintenanceRecord[];
  currentMileage: number;
  onRefresh: () => void;
  lang: Language;
}

export function MaintenanceTable({ spreadsheetId, records, currentMileage, onRefresh, lang }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<MaintenanceRecord>>({});
  const [isSaving, setIsSaving] = useState(false);
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

  const handleEdit = (record: MaintenanceRecord) => {
    setEditingId(record.id);
    setEditForm({ ...record });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleSave = async (originalIndex: number) => {
    setIsSaving(true);
    try {
      await addMaintenanceRecord(spreadsheetId, 'Sheet1', editForm as MaintenanceRecord, originalIndex + 2); // +2 for header row offset
      onRefresh();
      setEditingId(null);
    } catch (e) {
      alert('Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      alert('Uploading receipt to Google Drive...');
      const res = await uploadReceipt(file);
      if (res.webViewLink) {
        setEditForm(prev => ({ ...prev, receiptLink: res.webViewLink }));
        alert('Upload complete!');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to upload receipt');
    }
  };

  const getStatusColor = (record: MaintenanceRecord) => {
    if (!record.maxMileageForChange) return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border border-transparent dark:border-gray-700 transition-colors';
    const diff = record.maxMileageForChange - currentMileage;
    if (diff <= 0) return 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/50 transition-colors';
    if (diff < 1000) return 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50 transition-colors';
    return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 transition-colors';
  };

  const getStatusText = (record: MaintenanceRecord) => {
    if (!record.maxMileageForChange) return lang === 'ar' ? 'غير محدد' : 'Not Set';
    const diff = record.maxMileageForChange - currentMileage;
    if (diff <= 0) return t[lang].overdue;
    if (diff < 1000) return t[lang].upcoming;
    return t[lang].good;
  };

  // Grouping logic
  const groupedRecords = useMemo(() => {
    const withOriginalIndex = records.map((r, i) => ({ ...r, originalIndex: i }));
    
    // Sort descending by date
    withOriginalIndex.sort((a, b) => {
      const da = new Date(a.lastMaintenanceDate || 0).getTime();
      const db = new Date(b.lastMaintenanceDate || 0).getTime();
      return db - da;
    });

    const groups: { groupName: string; items: typeof withOriginalIndex }[] = [];
    
    withOriginalIndex.forEach(record => {
      let groupKey = lang === 'ar' ? 'بدون تاريخ' : 'No Date';
      if (record.lastMaintenanceDate) {
        const d = new Date(record.lastMaintenanceDate);
        if (!isNaN(d.getTime())) {
          groupKey = d.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { month: 'long', year: 'numeric' });
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
  }, [records, lang]);

  return (
    <div className="flex flex-col h-full bg-gray-50/50 dark:bg-gray-950/50 transition-colors" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="flex flex-col gap-3 p-4">
        {groupedRecords.map((group, groupIdx) => {
          const isCollapsed = collapsedGroups.has(group.groupName);
          return (
            <div key={group.groupName} className="flex flex-col gap-2">
              {/* Group Header */}
              <button 
                onClick={() => toggleGroup(group.groupName)}
                className="flex items-center justify-between bg-white dark:bg-gray-900 p-3 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-500 dark:text-emerald-400 transition-colors" />
                  <span className="font-bold text-gray-700 dark:text-gray-200 text-sm transition-colors">{group.groupName}</span>
                  <span className="text-gray-400 dark:text-gray-500 font-normal text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-md transition-colors">{group.items.length}</span>
                </div>
                {isCollapsed ? <ChevronLeft className="w-4 h-4 text-gray-400 dark:text-gray-500 rtl:rotate-180 transition-colors" /> : <ChevronDown className="w-4 h-4 text-gray-400 dark:text-gray-500 transition-colors" />}
              </button>
              
              {/* Group Items */}
              {!isCollapsed && (
                <div className="flex flex-col gap-3 mt-1">
                  {group.items.map((record) => {
                    const isEditing = editingId === record.id;

                    if (isEditing) {
                      return (
                        <div key={record.id} className="bg-emerald-50/50 dark:bg-emerald-900/10 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800/50 flex flex-col gap-3 transition-colors">
                          <input type="text" placeholder={t[lang].addMaintenance} value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg outline-none focus:border-emerald-500 dark:focus:border-emerald-400 text-sm font-bold bg-white dark:bg-gray-900 dark:text-white transition-colors" />
                          <div className="flex gap-2">
                            <div className="flex-1">
                              <label className="text-[10px] text-gray-500 dark:text-gray-400 transition-colors">{t[lang].mileageAtMaintenance}</label>
                              <input type="number" value={editForm.mileageAtMaintenance} onChange={e => setEditForm({...editForm, mileageAtMaintenance: Number(e.target.value)})} className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg outline-none focus:border-emerald-500 dark:focus:border-emerald-400 text-sm bg-white dark:bg-gray-900 dark:text-white transition-colors" />
                            </div>
                            <div className="flex-1">
                              <label className="text-[10px] text-gray-500 dark:text-gray-400 transition-colors">{t[lang].maxMileageForChange}</label>
                              <input type="number" value={editForm.maxMileageForChange} onChange={e => setEditForm({...editForm, maxMileageForChange: Number(e.target.value)})} className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg outline-none focus:border-emerald-500 dark:focus:border-emerald-400 text-sm bg-white dark:bg-gray-900 dark:text-white transition-colors" />
                            </div>
                          </div>
                          <div className="flex gap-2 items-end">
                            <div className="flex-1">
                              <label className="text-[10px] text-gray-500 dark:text-gray-400 transition-colors">{t[lang].cost}</label>
                              <input type="number" value={editForm.cost || ''} onChange={e => setEditForm({...editForm, cost: Number(e.target.value)})} className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg outline-none focus:border-emerald-500 dark:focus:border-emerald-400 text-sm bg-white dark:bg-gray-900 dark:text-white transition-colors" placeholder="0.0" />
                            </div>
                            <label className="cursor-pointer text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-2 rounded-lg transition-colors shadow-sm flex items-center justify-center h-10 w-10">
                              <Upload className="w-4 h-4" />
                              <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*,.pdf" />
                            </label>
                          </div>
                          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-emerald-100 dark:border-emerald-800/50 transition-colors">
                            <button onClick={() => handleSave(record.originalIndex)} disabled={isSaving} className="flex-1 bg-emerald-600 dark:bg-emerald-700 text-white font-bold py-2 rounded-lg hover:bg-emerald-700 dark:hover:bg-emerald-600 transition-colors flex justify-center items-center gap-2 text-sm">
                              <Check className="w-4 h-4" /> {t[lang].saveAndRecord}
                            </button>
                            <button onClick={handleCancel} className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex justify-center items-center text-sm">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div key={record.id} className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col relative transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className={`font-bold text-gray-900 dark:text-white px-2 ${lang === 'ar' ? 'border-r-2' : 'border-l-2'} border-emerald-500 dark:border-emerald-400 transition-colors`}>{record.name}</h4>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${getStatusColor(record)}`}>
                            {getStatusText(record)}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-y-3 mt-2 text-xs">
                          <div>
                            <span className="text-gray-400 dark:text-gray-500 block mb-0.5 transition-colors">{t[lang].mileageAtMaintenance}</span>
                            <span className="font-semibold text-gray-700 dark:text-gray-300 transition-colors">{record.mileageAtMaintenance ? record.mileageAtMaintenance.toLocaleString() : '-'}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 dark:text-gray-500 block mb-0.5 transition-colors">{t[lang].maxMileageForChange}</span>
                            <span className="font-semibold text-gray-700 dark:text-gray-300 transition-colors">{record.maxMileageForChange ? record.maxMileageForChange.toLocaleString() : '-'}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 dark:text-gray-500 block mb-0.5 transition-colors">{t[lang].cost}</span>
                            <span className="font-semibold text-gray-900 dark:text-white transition-colors">{record.cost ? `${record.cost.toLocaleString()} ${t[lang].currency}` : '-'}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 dark:text-gray-500 block mb-0.5 transition-colors">Receipt</span>
                            {record.receiptLink ? (
                              <a href={record.receiptLink} target="_blank" rel="noreferrer" className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 font-semibold underline transition-colors">View</a>
                            ) : (
                              <span className="text-gray-300 dark:text-gray-600 transition-colors">-</span>
                            )}
                          </div>
                        </div>

                        <button onClick={() => handleEdit(record)} className={`absolute top-3 ${lang === 'ar' ? 'left-3' : 'right-3'} text-gray-400 dark:text-gray-500 hover:text-emerald-600 dark:hover:text-emerald-400 p-1.5 rounded-full transition-colors bg-gray-50 dark:bg-gray-800 hover:bg-emerald-50 dark:hover:bg-gray-700`}>
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
