import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { InteractivePreview } from './components/InteractivePreview';
import { HowItWorks } from './components/HowItWorks';
import { SecurityPrivacy } from './components/SecurityPrivacy';
import { Faq } from './components/Faq';
import { Footer } from './components/Footer';
import { translations } from './translations';
import type { Language } from './translations';

export function App() {
  // Language state with persistent storage
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('autotracker_lang');
    if (saved === 'ar' || saved === 'en') return saved;
    // Default to Arabic or English based on browser
    return navigator.language.startsWith('ar') ? 'ar' : 'en';
  });

  // Dark mode state with persistent storage
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('autotracker_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Synchronize direction and language attribute on document
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    localStorage.setItem('autotracker_lang', lang);
  }, [lang]);

  // Synchronize dark theme class on document element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('autotracker_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('autotracker_theme', 'light');
    }
  }, [isDark]);

  const toggleLang = () => {
    setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const t = translations[lang];

  return (
    <div className={`min-h-screen flex flex-col font-sans ${lang === 'ar' ? 'font-arabic' : ''}`}>
      {/* Sticky Top Navigation */}
      <Navbar
        lang={lang}
        onToggleLang={toggleLang}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        t={t}
      />

      {/* Main Content */}
      <main className="flex-grow">
        <Hero lang={lang} t={t} />
        <Features lang={lang} t={t} />
        <InteractivePreview lang={lang} t={t} />
        <HowItWorks lang={lang} t={t} />
        <SecurityPrivacy lang={lang} t={t} />
        <Faq lang={lang} t={t} />
      </main>

      {/* Footer & CTA */}
      <Footer lang={lang} onToggleLang={toggleLang} t={t} />
    </div>
  );
}

export default App;
