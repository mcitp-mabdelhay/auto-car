import React from 'react';
import { Download, ArrowRight, ShieldCheck, HardDrive, CheckCircle2, Sparkles, FileSpreadsheet, Smartphone } from 'lucide-react';
import type { Language, TranslationContent } from '../translations';

interface HeroProps {
  lang: Language;
  t: TranslationContent;
}

export const Hero: React.FC<HeroProps> = ({ lang, t }) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-emerald-500/20 to-teal-400/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Text & CTAs (7 cols) */}
          <div className="lg:col-span-7 text-center lg:text-start space-y-6">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs sm:text-sm font-semibold tracking-wide">
              <Sparkles className="w-4 h-4" />
              <span>{t.hero.badge}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              {t.hero.titleLine1}{' '}
              <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 bg-clip-text text-transparent underline decoration-emerald-500/30 decoration-wavy decoration-2">
                {t.hero.titleHighlight}
              </span>{' '}
              {t.hero.titleLine2}
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              {t.hero.subtitle}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <a
                href="#download"
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-xl shadow-emerald-600/30 hover:shadow-2xl hover:shadow-emerald-600/40 hover:-translate-y-0.5 transition-all"
              >
                <Download className="w-5 h-5" />
                <span>{t.hero.downloadBtn}</span>
              </a>

              <a
                href="#demo"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-base font-semibold text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800/90 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all"
              >
                <span>{t.hero.demoBtn}</span>
                <ArrowRight className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} />
              </a>
            </div>

            {/* Store availability badges strip */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {lang === 'ar' ? 'المتاجر والمنصات:' : 'Platforms & Stores:'}
              </span>
              
              {/* Google Play Pill */}
              <a
                href="#download"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 transition-colors"
                title="Google Play (Coming Soon)"
              >
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5">
                  <path fill="#4285F4" d="M3.609 1.814L13.792 12 3.61 22.186c-.352-.337-.565-.82-.565-1.369V3.183c0-.55.213-1.032.564-1.369z"/>
                  <path fill="#FBBC05" d="M17.18 8.614l-3.388 3.386 3.388 3.386 3.827-2.174c1.09-.62 1.09-1.628 0-2.248L17.18 8.614z"/>
                  <path fill="#34A853" d="M3.609 22.186L13.792 12l3.388 3.386-10.748 6.104c-.65.37-1.428.272-1.823-.304z"/>
                  <path fill="#EA4335" d="M3.609 1.814c.395-.576 1.173-.674 1.823-.304l10.748 6.104-3.388 3.386L3.609 1.814z"/>
                </svg>
                <span>Google Play</span>
              </a>

              {/* Apple App Store Pill */}
              <a
                href="#download"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 transition-colors"
                title="Apple App Store (Coming Soon)"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.64 1.35-.57.65-1.07 1.71-.93 2.73 1 .08 2.03-.48 2.65-1.23z"/>
                </svg>
                <span>App Store</span>
              </a>

              {/* Huawei AppGallery Pill */}
              <a
                href="#download"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 transition-colors"
                title="Huawei AppGallery (Coming Soon)"
              >
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5">
                  <rect width="24" height="24" rx="6" fill="#CE1126"/>
                  <path d="M7 9h10v10H7z" fill="#FFF" opacity="0.2"/>
                  <path d="M8.5 8.5V6.5a3.5 3.5 0 0 1 7 0v2h-1.5V6.5a2 2 0 0 0-4 0v2H8.5zm-1.5 2.5h10a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1z" fill="#FFF"/>
                </svg>
                <span>AppGallery</span>
              </a>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>{t.hero.trust1}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                <span>{t.hero.trust2}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>{t.hero.trust3}</span>
              </div>
            </div>

          </div>

          {/* Right Column: Mobile App Frame Mockup (5 cols) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[320px] sm:max-w-[340px]">
              
              {/* Outer Phone Mockup Frame */}
              <div className="relative rounded-[42px] border-[10px] border-slate-900 dark:border-slate-800 bg-slate-950 p-2 shadow-2xl shadow-emerald-950/30 ring-1 ring-slate-800">
                {/* Speaker pill notch */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-900 rounded-full z-20 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-slate-800 mr-2" />
                  <div className="w-8 h-1 bg-slate-700 rounded-full" />
                </div>

                {/* Inner Screen Preview */}
                <div className="bg-slate-50 dark:bg-slate-900 rounded-[34px] overflow-hidden pt-8 pb-4 px-4 text-slate-900 dark:text-white select-none border border-slate-200 dark:border-slate-800">
                  
                  {/* Mock Top Status Bar */}
                  <div className="flex items-center justify-between pb-3 text-[11px] font-semibold text-slate-400">
                    <span>9:41</span>
                    <div className="flex items-center gap-1">
                      <span>5G</span>
                      <div className="w-4 h-2.5 border border-slate-400 rounded-sm p-0.5">
                        <div className="w-full h-full bg-emerald-500 rounded-[1px]" />
                      </div>
                    </div>
                  </div>

                  {/* Mock App Header */}
                  <div className="flex items-center justify-between pb-3">
                    <div>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider block">
                        AutoTracker
                      </span>
                      <h3 className="font-extrabold text-base">
                        {lang === 'ar' ? 'سيارتي (هيونداي إلنترا)' : 'My Car (Elantra)'}
                      </h3>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 font-bold text-xs">
                      <Smartphone className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Mock Mileage Hero Card */}
                  <div className="rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 p-4 text-white shadow-lg shadow-emerald-700/20 mb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-emerald-100">
                        {lang === 'ar' ? 'العداد الحالي' : 'Current Mileage'}
                      </span>
                      <span className="text-[10px] bg-emerald-500/40 text-emerald-100 px-2 py-0.5 rounded-full font-semibold">
                        Google Sheets ✓
                      </span>
                    </div>
                    <div className="mt-1 flex items-baseline gap-1.5">
                      <span className="text-2xl font-black tracking-tight">124,500</span>
                      <span className="text-xs text-emerald-200 font-bold">
                        {lang === 'ar' ? 'كم' : 'km'}
                      </span>
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-emerald-500/40 flex items-center justify-between text-[11px]">
                      <span className="text-emerald-100">
                        {lang === 'ar' ? 'أقرب صيانة:' : 'Next Service:'}
                      </span>
                      <span className="font-bold text-amber-200">
                        125,000 {lang === 'ar' ? 'كم' : 'km'}
                      </span>
                    </div>
                  </div>

                  {/* Mock Component Health List */}
                  <div className="space-y-2 mb-3">
                    {/* Item 1 */}
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 shadow-sm">
                      <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-100">
                          {lang === 'ar' ? 'زيت المحرك والفلتر' : 'Engine Oil & Filter'}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {lang === 'ar' ? 'مطلوب عند 125,000 كم' : 'Due at 125,000 km'}
                        </p>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400">
                        {lang === 'ar' ? 'قادمة (500 كم)' : 'Due Soon'}
                      </span>
                    </div>

                    {/* Item 2 */}
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 shadow-sm">
                      <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-100">
                          {lang === 'ar' ? 'تيل الفرامل الأمامي' : 'Front Brake Pads'}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {lang === 'ar' ? 'مطلوب عند 135,000 كم' : 'Due at 135,000 km'}
                        </p>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                        {lang === 'ar' ? 'جيدة' : 'Good'}
                      </span>
                    </div>

                    {/* Item 3 */}
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 shadow-sm">
                      <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-100">
                          {lang === 'ar' ? 'شمعات الاحتراق (البوجيهات)' : 'Spark Plugs'}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {lang === 'ar' ? 'آخر صيانة 100,000 كم' : 'Last done 100,000 km'}
                        </p>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                        {lang === 'ar' ? 'جيدة' : 'Good'}
                      </span>
                    </div>
                  </div>

                  {/* Mock Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 text-center text-[11px] font-bold">
                    <div className="py-2 rounded-xl bg-emerald-600 text-white shadow-sm">
                      {lang === 'ar' ? '+ تسجيل صيانة' : '+ Add Service'}
                    </div>
                    <div className="py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                      {lang === 'ar' ? '⛽ وقود سريع' : '⛽ Fuel Log'}
                    </div>
                  </div>

                </div>
              </div>

              {/* Decorative floating badges around phone */}
              <div className="absolute -top-4 -right-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 shadow-xl hidden sm:flex items-center gap-2.5 text-xs font-semibold text-slate-800 dark:text-slate-100">
                <div className="w-8 h-8 rounded-xl bg-green-500/10 flex items-center justify-center text-green-600 font-bold">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400">Google Drive</p>
                  <p>Auto-Synced Sheet</p>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 shadow-xl hidden sm:flex items-center gap-2.5 text-xs font-semibold text-slate-800 dark:text-slate-100">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 font-bold">
                  <HardDrive className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400">Receipt Vault</p>
                  <p>Invoices Preserved</p>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Highlight Stats Strip */}
        <div className="mt-16 pt-10 border-t border-slate-200/80 dark:border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400">
              {t.stats.stat1Value}
            </div>
            <p className="mt-1 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
              {t.stats.stat1Label}
            </p>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-teal-600 dark:text-teal-400">
              {t.stats.stat2Value}
            </div>
            <p className="mt-1 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
              {t.stats.stat2Label}
            </p>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400">
              {t.stats.stat3Value}
            </div>
            <p className="mt-1 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
              {t.stats.stat3Label}
            </p>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-amber-500 dark:text-amber-400">
              {t.stats.stat4Value}
            </div>
            <p className="mt-1 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
              {t.stats.stat4Label}
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
