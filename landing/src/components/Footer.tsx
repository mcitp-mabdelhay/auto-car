import React from 'react';
import { Heart, Shield, FileText } from 'lucide-react';
import type { Language, TranslationContent } from '../translations';
import { StoreBadges } from './StoreBadges';

const GithubIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

interface FooterProps {
  lang: Language;
  onToggleLang: () => void;
  t: TranslationContent;
}

export const Footer: React.FC<FooterProps> = ({ lang, onToggleLang, t }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      
      {/* Call to Action Section */}
      <div id="download" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="relative rounded-3xl bg-gradient-to-tr from-emerald-950 via-slate-800 to-teal-950 p-8 sm:p-14 border border-emerald-500/30 overflow-hidden shadow-2xl text-center">
          {/* Subtle decoration */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
            <div className="max-w-2xl mx-auto space-y-3">
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold uppercase tracking-wider">
                Ready to take control?
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                {t.cta.title}
              </h2>
              <p className="text-base sm:text-lg text-slate-300">
                {t.cta.subtitle}
              </p>
            </div>

            <div className="pt-2">
              <StoreBadges t={t} variant="section" />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <a
                href="https://github.com/mcitp-mabdelhay/auto-car"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl text-sm font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 shadow-sm transition-all"
              >
                <GithubIcon className="w-5 h-5" />
                <span>{t.cta.githubRepo}</span>
              </a>
            </div>

            <p className="text-xs text-slate-400 font-medium">
              {t.cta.note}
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Col 1: Brand */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <img
                src="/icon.png"
                alt="AutoTracker Logo"
                className="w-9 h-9 rounded-xl shadow-md shadow-emerald-500/20 object-cover"
              />
              <span className="font-extrabold text-xl tracking-tight text-white">
                AutoTracker
              </span>
            </div>
            <p className="text-sm max-w-sm text-slate-400 leading-relaxed">
              {t.footer.tagline}
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/mcitp-mabdelhay/auto-car"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                title="GitHub"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
              <button
                onClick={onToggleLang}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                {lang === 'ar' ? 'Switch to English' : 'التحويل للعربية'}
              </button>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#features" className="hover:text-emerald-400 transition-colors">{t.nav.features}</a></li>
              <li><a href="#demo" className="hover:text-emerald-400 transition-colors">{t.nav.demo}</a></li>
              <li><a href="#how-it-works" className="hover:text-emerald-400 transition-colors">{t.nav.howItWorks}</a></li>
              <li><a href="#security" className="hover:text-emerald-400 transition-colors">{t.nav.privacy}</a></li>
              <li><a href="#faq" className="hover:text-emerald-400 transition-colors">{t.nav.faq}</a></li>
            </ul>
          </div>

          {/* Col 3: Resources */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              {t.footer.resources}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://github.com/mcitp-mabdelhay/auto-car"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  <span>{t.footer.sourceCode}</span>
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/mcitp-mabdelhay/auto-car/releases"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{t.footer.releaseNotes}</span>
                </a>
              </li>
              <li>
                <a
                  href="#security"
                  className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>{t.footer.privacyPolicy}</span>
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-slate-800 text-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>{t.footer.copyright}</p>
          <p className="flex items-center gap-1 text-slate-500">
            Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for car enthusiasts.
          </p>
        </div>
      </div>

    </footer>
  );
};
