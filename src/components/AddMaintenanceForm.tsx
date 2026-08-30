import React, { useState } from 'react';
import { addMaintenanceRecord } from '../lib/parser';
import { Plus, Loader2 } from 'lucide-react';
import { t, Language } from '../locales';

interface Props {
  spreadsheetId: string;
  onRefresh: () => void;
  lang: Language;
}

export function AddMaintenanceForm({ spreadsheetId, onRefresh, lang }: Props) {
  const [name, setName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [mileage, setMileage] = useState('');
  const [maxMileage, setMaxMileage] = useState('');
  const [cost, setCost] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !date || !mileage) return;
    
    setIsSubmitting(true);
    try {
      await addMaintenanceRecord(
        spreadsheetId, 
        'Sheet1', 
        {
          name,
          lastMaintenanceDate: date,
          mileageAtMaintenance: Number(mileage),
          cost: cost ? Number(cost) : 0,
          minMileageForChange: 0,
          maxMileageForChange: maxMileage ? Number(maxMileage) : 0,
          receiptLink: ''
        }
      );
      
      // Reset form
      setName('');
      setMileage('');
      setMaxMileage('');
      setCost('');
      
      // Refresh dashboard data
      onRefresh();
    } catch (err) {
      console.error(err);
      alert('Failed to add maintenance record.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full gap-4 transition-colors">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase transition-colors">{t[lang].addMaintenance}</label>
        <input 
          type="text" 
          value={name} 
          onChange={e => setName(e.target.value)} 
          required
          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm font-medium text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 transition-colors"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase transition-colors">{t[lang].date}</label>
        <input 
          type="date" 
          value={date} 
          onChange={e => setDate(e.target.value)} 
          required
          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm font-medium text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 transition-colors"
        />
      </div>

      <div className="flex gap-4">
        <div className="flex flex-col gap-1.5 flex-1">
          <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase transition-colors">{t[lang].mileageAtMaintenance}</label>
          <input 
            type="number" 
            value={mileage} 
            onChange={e => setMileage(e.target.value)} 
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm font-medium text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 transition-colors"
          />
        </div>

        <div className="flex flex-col gap-1.5 flex-1">
          <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase transition-colors">{t[lang].maxMileageForChange}</label>
          <input 
            type="number" 
            value={maxMileage} 
            onChange={e => setMaxMileage(e.target.value)} 
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm font-medium text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 transition-colors"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase transition-colors">{t[lang].cost} ({t[lang].currency})</label>
        <input 
          type="number" 
          value={cost} 
          onChange={e => setCost(e.target.value)} 
          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm font-medium text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 transition-colors"
        />
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="mt-auto w-full bg-gray-900 dark:bg-emerald-600 hover:bg-gray-800 dark:hover:bg-emerald-700 disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:text-gray-400 dark:disabled:text-gray-500 disabled:cursor-not-allowed text-white font-bold py-3.5 px-4 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
      >
        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Plus className="w-5 h-5" /> {t[lang].saveAndRecord}</>}
      </button>
    </form>
  );
}
