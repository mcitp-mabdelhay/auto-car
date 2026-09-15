import React, { useState } from 'react';
import {
  Gauge,
  CheckCircle,
  AlertTriangle,
  Clock,
  Sparkles,
  Fuel,
  PlusCircle,
  FileSpreadsheet,
  Receipt,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import type { Language, TranslationContent } from '../translations';

interface InteractivePreviewProps {
  lang: Language;
  t: TranslationContent;
}

export const InteractivePreview: React.FC<InteractivePreviewProps> = ({ lang, t }) => {
  // Interactive simulated state
  const [currentMileage, setCurrentMileage] = useState<number>(124800);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'sheet' | 'receipts'>('dashboard');

  // Realistic mock maintenance components with threshold logic
  const serviceItems = [
    {
      id: 'oil',
      name: t.demo.engineOil,
      lastMileage: 115000,
      minChange: 124000,
      maxChange: 125000,
      cost: 1450,
      interval: 10000,
    },
    {
      id: 'brakes',
      name: t.demo.brakePads,
      lastMileage: 100000,
      minChange: 130000,
      maxChange: 135000,
      cost: 2100,
      interval: 30000,
    },
    {
      id: 'transmission',
      name: t.demo.transmissionFluid,
      lastMileage: 85000,
      minChange: 120000,
      maxChange: 125000,
      cost: 3200,
      interval: 40000,
    },
    {
      id: 'plugs',
      name: t.demo.sparkPlugs,
      lastMileage: 90000,
      minChange: 140000,
      maxChange: 150000,
      cost: 1800,
      interval: 50000,
    },
  ];

  // Calculate dynamic status for each item based on current slider mileage
  const getStatus = (item: (typeof serviceItems)[0]) => {
    if (currentMileage >= item.maxChange) {
      return {
        status: 'overdue',
        label: t.demo.overdueBadge,
        color: 'text-rose-600 dark:text-rose-400',
        bg: 'bg-rose-100 dark:bg-rose-950/60 border-rose-200 dark:border-rose-900',
        badgeBg: 'bg-rose-500 text-white',
        diff: currentMileage - item.maxChange,
        diffText: lang === 'ar' ? `متأخر بـ ${(currentMileage - item.maxChange).toLocaleString()} كم` : `${(currentMileage - item.maxChange).toLocaleString()} km overdue`,
        icon: AlertTriangle,
      };
    } else if (currentMileage >= item.minChange) {
      return {
        status: 'upcoming',
        label: t.demo.upcomingBadge,
        color: 'text-amber-600 dark:text-amber-400',
        bg: 'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-900',
        badgeBg: 'bg-amber-500 text-white',
        diff: item.maxChange - currentMileage,
        diffText: lang === 'ar' ? `متبقي ${(item.maxChange - currentMileage).toLocaleString()} كم` : `${(item.maxChange - currentMileage).toLocaleString()} km remaining`,
        icon: Clock,
      };
    } else {
      return {
        status: 'good',
        label: t.demo.goodBadge,
        color: 'text-emerald-600 dark:text-emerald-400',
        bg: 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700',
        badgeBg: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400',
        diff: item.maxChange - currentMileage,
        diffText: lang === 'ar' ? `متبقي ${(item.maxChange - currentMileage).toLocaleString()} كم` : `${(item.maxChange - currentMileage).toLocaleString()} km remaining`,
        icon: CheckCircle,
      };
    }
  };

  const overdueCount = serviceItems.filter((i) => currentMileage >= i.maxChange).length;
  const upcomingCount = serviceItems.filter(
    (i) => currentMileage >= i.minChange && currentMileage < i.maxChange
  ).length;

  return (
    <section id="demo" className="py-20 md:py-28 bg-slate-100/70 dark:bg-slate-900/60 border-y border-slate-200/80 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.demo.sectionTag}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.demo.title}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-400">
            {t.demo.subtitle}
          </p>
        </div>

        {/* Interactive Dashboard Container */}
        <div className="max-w-4xl mx-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
          
          {/* Top Tabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 px-4 sm:px-6 pt-3">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-colors ${
                activeTab === 'dashboard'
                  ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 dark:border-emerald-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Gauge className="w-4 h-4" />
              <span>{lang === 'ar' ? 'لوحة القيادة التفاعلية' : 'Vehicle Dashboard'}</span>
            </button>
            <button
              onClick={() => setActiveTab('sheet')}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-colors ${
                activeTab === 'sheet'
                  ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 dark:border-emerald-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>{lang === 'ar' ? 'معاينة Google Sheet الحيّة' : 'Live Google Sheet Mirror'}</span>
            </button>
            <button
              onClick={() => setActiveTab('receipts')}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-colors ${
                activeTab === 'receipts'
                  ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 dark:border-emerald-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Receipt className="w-4 h-4" />
              <span>{lang === 'ar' ? 'إيصالات Drive' : 'Drive Receipts Vault'}</span>
            </button>
          </div>

          {/* Tab 1: Interactive Dashboard */}
          {activeTab === 'dashboard' && (
            <div className="p-6 sm:p-8 space-y-8">
              
              {/* Slider Control Box */}
              <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-5 sm:p-6 border border-slate-200 dark:border-slate-700">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Gauge className="w-5 h-5 text-emerald-600" />
                      {t.demo.odometerTitle}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {t.demo.odometerHint}
                    </p>
                  </div>
                  <div className="inline-flex items-baseline gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white font-black text-xl shadow-md">
                    <span>{currentMileage.toLocaleString()}</span>
                    <span className="text-xs font-semibold text-emerald-100">
                      {lang === 'ar' ? 'كم' : 'km'}
                    </span>
                  </div>
                </div>

                <input
                  type="range"
                  min="110000"
                  max="155000"
                  step="500"
                  value={currentMileage}
                  onChange={(e) => setCurrentMileage(Number(e.target.value))}
                  className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />

                <div className="flex justify-between text-[11px] font-semibold text-slate-400 mt-2">
                  <span>110,000 km</span>
                  <span className="text-emerald-600 font-bold">125,000 km (Oil Limit)</span>
                  <span>155,000 km</span>
                </div>
              </div>

              {/* Status Alert Pills */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  {lang === 'ar' ? 'ملخص التنبيهات:' : 'Current Status:'}
                </span>
                {overdueCount > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-400">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    {overdueCount} {lang === 'ar' ? 'صيانة متأخرة تحتاج فحص فوري' : 'Overdue alert(s)'}
                  </span>
                )}
                {upcomingCount > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400">
                    <Clock className="w-3.5 h-3.5" />
                    {upcomingCount} {lang === 'ar' ? 'صيانة قادمة قريباً' : 'Upcoming service(s)'}
                  </span>
                )}
                {overdueCount === 0 && upcomingCount === 0 && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400">
                    <CheckCircle className="w-3.5 h-3.5" />
                    {lang === 'ar' ? 'جميع أجزاء السيارة في حالة ممتازة' : 'All vehicle systems in good order'}
                  </span>
                )}
              </div>

              {/* Maintenance Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {serviceItems.map((item) => {
                  const s = getStatus(item);
                  const Icon = s.icon;
                  return (
                    <div
                      key={item.id}
                      className={`p-4 rounded-2xl border transition-all duration-200 ${s.bg}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className={`p-2 rounded-xl ${s.badgeBg}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                              {item.name}
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {t.demo.lastDoneAt} {item.lastMileage.toLocaleString()} {lang === 'ar' ? 'كم' : 'km'}
                            </p>
                          </div>
                        </div>

                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${s.badgeBg}`}>
                          {s.label}
                        </span>
                      </div>

                      <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
                        <span className="text-slate-500 dark:text-slate-400">
                          {t.demo.dueAt}: <strong className="text-slate-800 dark:text-slate-200">{item.maxChange.toLocaleString()} {lang === 'ar' ? 'كم' : 'km'}</strong>
                        </span>
                        <span className={`font-extrabold ${s.color}`}>
                          {s.diffText}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Quick Action Bar */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors">
                    <PlusCircle className="w-4 h-4" />
                    <span>{t.demo.addRecordMock}</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors">
                    <Fuel className="w-4 h-4 text-amber-500" />
                    <span>{t.demo.quickFuelMock}</span>
                  </button>
                </div>

                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{t.demo.syncIndicator}</span>
                </div>
              </div>

            </div>
          )}

          {/* Tab 2: Live Google Sheet Mirror */}
          {activeTab === 'sheet' && (
            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                    Google Sheets Mirror: <span className="text-emerald-600 font-mono text-xs">AutoTracker_Data.xlsx</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    {lang === 'ar'
                      ? 'هذا ما يتم تخزينه مباشرة في ملفك الخاص داخل Google Drive بدون أي خوادم وسيطة.'
                      : 'This is the clean tabular data stored directly in your own Google Drive spreadsheet.'}
                  </p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                  Read & Write
                </span>
              </div>

              {/* Mock Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
                <table className="w-full text-left rtl:text-right text-xs">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase font-semibold">
                    <tr>
                      <th className="px-3 py-2.5">ID</th>
                      <th className="px-3 py-2.5">{lang === 'ar' ? 'اسم الصيانة' : 'Item Name'}</th>
                      <th className="px-3 py-2.5">{lang === 'ar' ? 'عداد الصيانة' : 'Mileage (km)'}</th>
                      <th className="px-3 py-2.5">{lang === 'ar' ? 'أقصى عداد' : 'Max Limit'}</th>
                      <th className="px-3 py-2.5">{lang === 'ar' ? 'التكلفة' : 'Cost'}</th>
                      <th className="px-3 py-2.5">{lang === 'ar' ? 'الإيصال' : 'Drive Link'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono">
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="px-3 py-2 text-slate-400">#01</td>
                      <td className="px-3 py-2 font-sans font-bold text-slate-800 dark:text-slate-200">{t.demo.engineOil}</td>
                      <td className="px-3 py-2">115,000</td>
                      <td className="px-3 py-2 text-emerald-600 font-bold">125,000</td>
                      <td className="px-3 py-2">1,450 EGP</td>
                      <td className="px-3 py-2 text-blue-500 underline flex items-center gap-1">
                        drive.google.com/.. <ExternalLink className="w-3 h-3" />
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="px-3 py-2 text-slate-400">#02</td>
                      <td className="px-3 py-2 font-sans font-bold text-slate-800 dark:text-slate-200">{t.demo.brakePads}</td>
                      <td className="px-3 py-2">100,000</td>
                      <td className="px-3 py-2 text-emerald-600 font-bold">135,000</td>
                      <td className="px-3 py-2">2,100 EGP</td>
                      <td className="px-3 py-2 text-blue-500 underline flex items-center gap-1">
                        drive.google.com/.. <ExternalLink className="w-3 h-3" />
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="px-3 py-2 text-slate-400">#03</td>
                      <td className="px-3 py-2 font-sans font-bold text-slate-800 dark:text-slate-200">{t.demo.transmissionFluid}</td>
                      <td className="px-3 py-2">85,000</td>
                      <td className="px-3 py-2 text-emerald-600 font-bold">125,000</td>
                      <td className="px-3 py-2">3,200 EGP</td>
                      <td className="px-3 py-2 text-blue-500 underline flex items-center gap-1">
                        drive.google.com/.. <ExternalLink className="w-3 h-3" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 3: Receipts Vault */}
          {activeTab === 'receipts' && (
            <div className="p-6 sm:p-8 space-y-5">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-emerald-600" />
                  {lang === 'ar' ? 'أرشيف إيصالات وفواتير Drive' : 'Google Drive Receipt Vault'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {lang === 'ar'
                    ? 'يتم تخزين صور الفواتير في مجلد خاص AutoTracker_Receipts داخل حسابك مباشرة.'
                    : 'Invoice images are neatly kept inside the AutoTracker_Receipts folder in your Google Drive.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-3 text-center space-y-2">
                  <div className="h-28 rounded-lg bg-slate-200 dark:bg-slate-700 flex flex-col items-center justify-center text-slate-400">
                    <Receipt className="w-8 h-8 mb-1 text-slate-500" />
                    <span className="text-[10px] font-mono">invoice_115k_oil.jpg</span>
                  </div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {lang === 'ar' ? 'فاتورة غيار زيت وبواجي' : 'Castrol Oil & Filter'}
                  </p>
                  <p className="text-[10px] text-slate-400">1,450 EGP • 15 Jan 2026</p>
                </div>

                <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-3 text-center space-y-2">
                  <div className="h-28 rounded-lg bg-slate-200 dark:bg-slate-700 flex flex-col items-center justify-center text-slate-400">
                    <Receipt className="w-8 h-8 mb-1 text-slate-500" />
                    <span className="text-[10px] font-mono">invoice_brakes_parts.png</span>
                  </div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {lang === 'ar' ? 'إيصال تيل فرامل أصلي' : 'OEM Front Brake Pads'}
                  </p>
                  <p className="text-[10px] text-slate-400">2,100 EGP • 03 Feb 2026</p>
                </div>

                <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-3 text-center space-y-2">
                  <div className="h-28 rounded-lg bg-slate-200 dark:bg-slate-700 flex flex-col items-center justify-center text-slate-400">
                    <Receipt className="w-8 h-8 mb-1 text-slate-500" />
                    <span className="text-[10px] font-mono">receipt_fuel_95.jpg</span>
                  </div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {lang === 'ar' ? 'تفويلة وقود 95 كاملة' : 'Full Fuel Tank 95'}
                  </p>
                  <p className="text-[10px] text-slate-400">650 EGP • 12 Mar 2026</p>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
