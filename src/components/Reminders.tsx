import React, { useState } from 'react';
import { MaintenanceRecord } from '../types';
import { Bell, Calendar, Mail, Check, AlertTriangle, CheckCircle2, Clock, Loader2 } from 'lucide-react';
import { t, Language } from '../locales';
import { createCalendarEvent, sendEmail } from '../lib/googleApi';

interface Props {
  upcomingMaintenance: MaintenanceRecord[];
  overdueMaintenance: MaintenanceRecord[];
  currentMileage: number;
  userEmail: string;
  lang: Language;
}

export function Reminders({ upcomingMaintenance, overdueMaintenance, currentMileage, userEmail, lang }: Props) {
  const [addingToCalendar, setAddingToCalendar] = useState<string | null>(null);
  const [addedToCalendar, setAddedToCalendar] = useState<Set<string>>(new Set());
  
  const [sendingEmail, setSendingEmail] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState<Set<string>>(new Set());

  const handleAddToCalendar = async (record: MaintenanceRecord) => {
    setAddingToCalendar(record.id);
    try {
      // Schedule for tomorrow since it's upcoming
      const date = new Date(Date.now() + 86400000).toISOString().split('T')[0];
      await createCalendarEvent(
        `Maintenance Due: ${record.name}`,
        `Upcoming maintenance for your vehicle. Milestone: ${record.maxMileageForChange} km. Current: ${currentMileage} km.`,
        date
      );
      setAddedToCalendar(prev => new Set(prev).add(record.id));
    } catch (e) {
      console.error(e);
      alert('Failed to add to calendar');
    } finally {
      setAddingToCalendar(null);
    }
  };

  const handleSendReminderEmail = async (record: MaintenanceRecord) => {
    setSendingEmail(record.id);
    try {
      const isArabic = lang === 'ar';
      await sendEmail(
        userEmail, 
        isArabic ? `⚠️ تنبيه صيانة متأخرة: ${record.name}` : `⚠️ Overdue Maintenance Alert: ${record.name}`,
        `<div dir="${isArabic ? 'rtl' : 'ltr'}" style="font-family: sans-serif;">
          <h2>${isArabic ? 'صيانة مستحقة فوراً!' : 'Maintenance Overdue!'}</h2>
          <p>${isArabic ? 'لقد تجاوزت العداد الأقصى للصيانة التالية:' : 'You have exceeded the maximum mileage for the following maintenance:'}</p>
          <ul>
            <li><strong>${record.name}</strong></li>
            <li>${isArabic ? 'الموعد الأقصى:' : 'Max Mileage:'} ${record.maxMileageForChange} ${t[lang].km}</li>
            <li>${isArabic ? 'العداد الحالي:' : 'Current Mileage:'} ${currentMileage} ${t[lang].km}</li>
          </ul>
          <p>${isArabic ? 'يرجى تحديد موعد للصيانة في أقرب وقت ممكن لتجنب الأضرار.' : 'Please schedule a service as soon as possible to avoid vehicle damage.'}</p>
        </div>`
      );
      setEmailSent(prev => new Set(prev).add(record.id));
    } catch (e) {
      console.error(e);
      alert('Failed to send email');
    } finally {
      setSendingEmail(null);
    }
  };

  if (upcomingMaintenance.length === 0 && overdueMaintenance.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-[24px] border border-gray-100 dark:border-gray-800 shadow-sm p-5 flex flex-col gap-4 min-h-[200px] justify-center items-center text-center transition-colors">
        <div className="bg-emerald-50 dark:bg-emerald-900/30 p-4 rounded-full transition-colors">
          <CheckCircle2 className="w-8 h-8 text-emerald-500 dark:text-emerald-400 transition-colors" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white transition-colors">{t[lang].reminders}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 transition-colors">{t[lang].noReminders}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-[24px] border border-gray-100 dark:border-gray-800 shadow-sm p-5 flex flex-col gap-4 transition-colors">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 transition-colors">
          <Bell className="w-5 h-5 text-emerald-600 dark:text-emerald-500 transition-colors" />
          {t[lang].reminders}
        </h3>
        <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide transition-colors">
          {t[lang].remindersDesc}
        </p>
      </div>

      <div className="flex flex-col gap-3 mt-2">
        {overdueMaintenance.map(record => {
          const isSent = emailSent.has(record.id);
          const isSending = sendingEmail === record.id;
          
          return (
            <div key={record.id} className="flex items-center justify-between bg-red-50 dark:bg-red-900/20 p-4 rounded-2xl border border-red-100 dark:border-red-800/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="bg-white dark:bg-red-900/40 p-2 rounded-xl shadow-sm border border-red-100 dark:border-red-800/50 transition-colors">
                  <AlertTriangle className="w-5 h-5 text-red-500 dark:text-red-400" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-gray-900 dark:text-white text-sm transition-colors">{record.name}</span>
                  <span className="text-xs text-red-600 dark:text-red-400 font-medium flex items-center gap-1 transition-colors">
                    {t[lang].overdue} • {record.maxMileageForChange?.toLocaleString()} {t[lang].km}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => handleSendReminderEmail(record)}
                disabled={isSent || isSending}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-sm
                  ${isSent 
                    ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' 
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-emerald-600 dark:hover:text-emerald-400'
                  }`}
              >
                {isSending ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-gray-400" />
                ) : isSent ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <Mail className="w-3.5 h-3.5" />
                )}
                {isSent ? t[lang].emailSent : t[lang].sendReminderEmail}
              </button>
            </div>
          );
        })}

        {upcomingMaintenance.map(record => {
          const isAdded = addedToCalendar.has(record.id);
          const isAdding = addingToCalendar === record.id;

          return (
            <div key={record.id} className="flex items-center justify-between bg-amber-50 dark:bg-amber-900/20 p-4 rounded-2xl border border-amber-100 dark:border-amber-800/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="bg-white dark:bg-amber-900/40 p-2 rounded-xl shadow-sm border border-amber-100 dark:border-amber-800/50 transition-colors">
                  <Clock className="w-5 h-5 text-amber-500 dark:text-amber-400" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-gray-900 dark:text-white text-sm transition-colors">{record.name}</span>
                  <span className="text-xs text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1 transition-colors">
                    {t[lang].upcoming} • {record.maxMileageForChange?.toLocaleString()} {t[lang].km}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => handleAddToCalendar(record)}
                disabled={isAdded || isAdding}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-sm
                  ${isAdded 
                    ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' 
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-emerald-600 dark:hover:text-emerald-400'
                  }`}
              >
                {isAdding ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-gray-400" />
                ) : isAdded ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <Calendar className="w-3.5 h-3.5" />
                )}
                {isAdded ? t[lang].addedToCalendar : t[lang].addToCalendar}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
