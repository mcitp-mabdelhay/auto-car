import React from 'react';
import { ArrowDownToLine } from 'lucide-react';
import type { TranslationContent } from '../translations';

interface StoreBadgesProps {
  t: TranslationContent;
  variant?: 'hero' | 'section';
}

// Configurable store links for future deployment
export const STORE_URLS = {
  googlePlay: '#', // Set to official URL when published: e.g. https://play.google.com/store/apps/details?id=com.autotracker.app
  appStore: '#',   // Set to official URL when published: e.g. https://apps.apple.com/app/autotracker/id123456789
  appGallery: '#', // Set to official URL when published: e.g. https://appgallery.huawei.com/app/C123456789
  apkDirect: 'https://github.com/mcitp-mabdelhay/auto-car/releases/latest',
};

export const StoreBadges: React.FC<StoreBadgesProps> = ({ t, variant = 'section' }) => {
  const isHero = variant === 'hero';

  return (
    <div className="w-full">
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 ${
          isHero ? 'gap-3' : 'lg:grid-cols-4 gap-4'
        }`}
      >
        {/* 1. Google Play Store */}
        <a
          href={STORE_URLS.googlePlay}
          onClick={(e) => {
            if (STORE_URLS.googlePlay === '#') {
              e.preventDefault();
              alert(t.stores.comingSoon + ': Google Play Store');
            }
          }}
          className="group relative flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-slate-900/90 hover:bg-slate-900 border border-slate-700/80 hover:border-emerald-500/60 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-200 text-left rtl:text-right"
        >
          <div className="flex items-center gap-3.5">
            {/* Google Play Vector Logo */}
            <div className="shrink-0 w-10 h-10 rounded-xl bg-slate-800/80 flex items-center justify-center p-2 border border-slate-700/60 group-hover:scale-105 transition-transform">
              <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-sm">
                <path fill="#4285F4" d="M3.609 1.814L13.792 12 3.61 22.186c-.352-.337-.565-.82-.565-1.369V3.183c0-.55.213-1.032.564-1.369z"/>
                <path fill="#FBBC05" d="M17.18 8.614l-3.388 3.386 3.388 3.386 3.827-2.174c1.09-.62 1.09-1.628 0-2.248L17.18 8.614z"/>
                <path fill="#34A853" d="M3.609 22.186L13.792 12l3.388 3.386-10.748 6.104c-.65.37-1.428.272-1.823-.304z"/>
                <path fill="#EA4335" d="M3.609 1.814c.395-.576 1.173-.674 1.823-.304l10.748 6.104-3.388 3.386L3.609 1.814z"/>
              </svg>
            </div>

            <div className="min-w-0 flex-1">
              <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400">
                {t.stores.getItOn}
              </span>
              <span className="block font-black text-base text-white tracking-tight truncate">
                {t.stores.googlePlay}
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/90 flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-medium">Android</span>
            <span className="inline-flex items-center gap-1.5 font-bold text-amber-400 px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              {t.stores.comingSoon}
            </span>
          </div>
        </a>

        {/* 2. Apple App Store */}
        <a
          href={STORE_URLS.appStore}
          onClick={(e) => {
            if (STORE_URLS.appStore === '#') {
              e.preventDefault();
              alert(t.stores.comingSoon + ': Apple App Store');
            }
          }}
          className="group relative flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-slate-900/90 hover:bg-slate-900 border border-slate-700/80 hover:border-emerald-500/60 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-200 text-left rtl:text-right"
        >
          <div className="flex items-center gap-3.5">
            {/* Apple Vector Logo */}
            <div className="shrink-0 w-10 h-10 rounded-xl bg-slate-800/80 flex items-center justify-center p-2 border border-slate-700/60 text-white group-hover:scale-105 transition-transform">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 drop-shadow-sm">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.64 1.35-.57.65-1.07 1.71-.93 2.73 1 .08 2.03-.48 2.65-1.23z"/>
              </svg>
            </div>

            <div className="min-w-0 flex-1">
              <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400">
                {t.stores.downloadOn}
              </span>
              <span className="block font-black text-base text-white tracking-tight truncate">
                {t.stores.appStore}
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/90 flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-medium">iOS / iPadOS</span>
            <span className="inline-flex items-center gap-1.5 font-bold text-amber-400 px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              {t.stores.comingSoon}
            </span>
          </div>
        </a>

        {/* 3. Huawei AppGallery */}
        <a
          href={STORE_URLS.appGallery}
          onClick={(e) => {
            if (STORE_URLS.appGallery === '#') {
              e.preventDefault();
              alert(t.stores.comingSoon + ': Huawei AppGallery');
            }
          }}
          className="group relative flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-slate-900/90 hover:bg-slate-900 border border-slate-700/80 hover:border-emerald-500/60 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-200 text-left rtl:text-right"
        >
          <div className="flex items-center gap-3.5">
            {/* Huawei AppGallery Vector Logo */}
            <div className="shrink-0 w-10 h-10 rounded-xl bg-slate-800/80 flex items-center justify-center p-1.5 border border-slate-700/60 group-hover:scale-105 transition-transform">
              <svg viewBox="0 0 24 24" className="w-7 h-7 drop-shadow-sm">
                <rect width="24" height="24" rx="6" fill="#CE1126"/>
                <path d="M7 9h10v10H7z" fill="#FFF" opacity="0.2"/>
                <path d="M8.5 8.5V6.5a3.5 3.5 0 0 1 7 0v2h-1.5V6.5a2 2 0 0 0-4 0v2H8.5zm-1.5 2.5h10a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1z" fill="#FFF"/>
                <path d="M10 13.5a2 2 0 1 0 4 0" stroke="#CE1126" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
              </svg>
            </div>

            <div className="min-w-0 flex-1">
              <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400">
                {t.stores.exploreOn}
              </span>
              <span className="block font-black text-base text-white tracking-tight truncate">
                {t.stores.appGallery}
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/90 flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-medium">HarmonyOS / Android</span>
            <span className="inline-flex items-center gap-1.5 font-bold text-amber-400 px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              {t.stores.comingSoon}
            </span>
          </div>
        </a>

        {/* 4. Direct Android APK */}
        <a
          href={STORE_URLS.apkDirect}
          target="_blank"
          rel="noreferrer"
          className="group relative flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 border border-emerald-400/40 shadow-xl shadow-emerald-950/40 hover:shadow-2xl hover:shadow-emerald-600/30 hover:-translate-y-1 transition-all duration-200 text-left rtl:text-right text-white"
        >
          <div className="flex items-center gap-3.5">
            {/* Android Logo */}
            <div className="shrink-0 w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center p-2 border border-white/20 group-hover:scale-105 transition-transform">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white drop-shadow-sm">
                <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.551 0 .9993.4482.9993.9993.0001.5511-.4483.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.4128 13.8533 8.125 12 8.125c-1.8533 0-3.5902.2878-5.1368.8247L4.8409 5.4467a.4161.4161 0 00-.5677-.1521.4157.4157 0 00-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.761h24c-.3432-4.1021-2.6889-7.5743-6.1185-9.4396"/>
              </svg>
            </div>

            <div className="min-w-0 flex-1">
              <span className="block text-[10px] uppercase font-bold tracking-wider text-emerald-100">
                {t.stores.directDownload}
              </span>
              <span className="block font-black text-base text-white tracking-tight truncate">
                {t.stores.apkDirect}
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-emerald-400/30 flex items-center justify-between text-[11px]">
            <span className="text-emerald-100 font-medium">v1.1.0</span>
            <span className="inline-flex items-center gap-1.5 font-bold text-white px-2.5 py-0.5 rounded-full bg-white/20 border border-white/30">
              <ArrowDownToLine className="w-3 h-3" />
              {t.stores.availableNow}
            </span>
          </div>
        </a>
      </div>
    </div>
  );
};
