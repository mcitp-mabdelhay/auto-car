import React from 'react';
import { LogIn, Link2, BellRing, CheckCircle, Navigation } from 'lucide-react';
import type { Language, TranslationContent } from '../translations';

interface HowItWorksProps {
  lang: Language;
  t: TranslationContent;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ t }) => {
  const stepIcons = [
    <LogIn className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
    <Link2 className="w-6 h-6 text-teal-600 dark:text-teal-400" />,
    <BellRing className="w-6 h-6 text-amber-500 dark:text-amber-400" />,
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-32 bg-slate-50/50 dark:bg-slate-900/30 border-t border-slate-200/80 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Navigation className="w-3.5 h-3.5" />
            <span>{t.howItWorks.sectionTag}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.howItWorks.title}
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            {t.howItWorks.subtitle}
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {t.howItWorks.steps.map((step, idx) => (
            <div
              key={step.stepNumber}
              className="relative p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between"
            >
              {/* Step indicator number */}
              <div className="flex items-center justify-between mb-8">
                <span className="font-mono text-4xl font-black text-emerald-600/20 dark:text-emerald-400/20">
                  {step.stepNumber}
                </span>
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  {stepIcons[idx]}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {step.desc}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle className="w-4 h-4" />
                <span>Zero hassle</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
