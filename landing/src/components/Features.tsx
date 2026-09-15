import React from 'react';
import {
  FileSpreadsheet,
  Receipt,
  Calendar,
  Gauge,
  Fuel,
  Languages,
  ArrowUpRight,
  Layers
} from 'lucide-react';
import type { Language, TranslationContent } from '../translations';

interface FeaturesProps {
  lang: Language;
  t: TranslationContent;
}

export const Features: React.FC<FeaturesProps> = ({ t }) => {
  const iconMap: Record<string, React.ReactNode> = {
    sheets: <FileSpreadsheet className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
    receipts: <Receipt className="w-6 h-6 text-teal-600 dark:text-teal-400" />,
    reminders: <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
    mileage: <Gauge className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
    expenses: <Fuel className="w-6 h-6 text-amber-600 dark:text-amber-400" />,
    bilingual: <Languages className="w-6 h-6 text-purple-600 dark:text-purple-400" />,
  };

  return (
    <section id="features" className="py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>{t.features.sectionTag}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.features.title}
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            {t.features.subtitle}
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {t.features.items.map((item) => (
            <div
              key={item.id}
              className="group relative p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-emerald-500/40 dark:hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    {iconMap[item.id] || <Layers className="w-6 h-6 text-emerald-600" />}
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {item.tag}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {item.title}
                </h3>

                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {item.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Learn more</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
