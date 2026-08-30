import React, { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { initAuth, googleSignIn, logout } from './lib/firebase';
import { Dashboard } from './components/Dashboard';
import { Car, LogIn, AlertCircle, Settings, FileSearch, Globe, Sun, Moon } from 'lucide-react';
import { createSpreadsheet } from './lib/googleApi';
import { initializeSheet } from './lib/parser';
import { showDrivePicker } from './lib/drivePicker';
import { t, Language } from './locales';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [needsAuth, setNeedsAuth] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'home' | 'settings'>('home');
  const [spreadsheetId, setSpreadsheetId] = useState(() => localStorage.getItem('spreadsheetId') || '');
  const [lang, setLang] = useState<Language>(() => (localStorage.getItem('lang') as Language) || 'ar');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => (localStorage.getItem('theme') as 'light' | 'dark') || 'light');

  useEffect(() => {
    document.documentElement.lang = lang;
    localStorage.setItem('lang', lang);
  }, [lang]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleLang = () => {
    setLang(prev => prev === 'ar' ? 'en' : 'ar');
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    const unsubscribe = initAuth(
      (u) => {
        setUser(u);
        setNeedsAuth(false);
      },
      () => {
        setUser(null);
        setNeedsAuth(true);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setNeedsAuth(false);
      }
    } catch (err: any) {
      console.error('Login failed:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        alert(lang === 'ar' ? 'تم إغلاق نافذة تسجيل الدخول. يرجى السماح بالنوافذ المنبثقة وعدم إغلاقها حتى يكتمل تسجيل الدخول.' : 'Login popup was closed. Please try again.');
      } else {
        alert(lang === 'ar' ? 'حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.' : 'Error during login. Please try again.');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleCreateSheet = async () => {
    setIsCreating(true);
    try {
      const res = await createSpreadsheet('AutoTracker Maintenance Sync');
      const newId = res.spreadsheetId;
      const firstSheetTitle = res.sheets?.[0]?.properties?.title || 'Sheet1';
      
      await initializeSheet(newId, firstSheetTitle);
      
      setSpreadsheetId(newId);
      localStorage.setItem('spreadsheetId', newId);
    } catch (err) {
      console.error('Failed to create sheet', err);
      alert(lang === 'ar' ? 'حدث خطأ أثناء إنشاء الملف.' : 'Failed to create sheet.');
    } finally {
      setIsCreating(false);
    }
  };

  if (needsAuth) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-6 transition-colors" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button onClick={toggleTheme} className="flex items-center justify-center bg-white dark:bg-gray-800 p-2 rounded-full shadow-sm text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 transition-colors">
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-indigo-500" />}
          </button>
          <button onClick={toggleLang} className="flex items-center gap-2 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-full shadow-sm text-sm font-bold text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 transition-colors">
            <Globe className="w-4 h-4 text-emerald-600" />
            {lang === 'ar' ? 'English' : 'العربية'}
          </button>
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full bg-white dark:bg-gray-900 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-gray-900/50 border border-gray-100 dark:border-gray-800 p-8 text-center flex flex-col gap-6 transition-colors">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center font-bold shadow-inner">
              <Car className="w-8 h-8" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight transition-colors">{t[lang].appTitle}</h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium transition-colors">{t[lang].syncDesc}</p>
          </div>
          
          <button 
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-emerald-200 dark:hover:border-emerald-700 text-gray-700 dark:text-gray-200 font-bold py-3 px-4 rounded-xl transition-all shadow-sm"
          >
            {isLoggingIn ? (
              <span className="animate-pulse">Connecting...</span>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  <path fill="none" d="M1 1h22v22H1z" />
                </svg>
                {t[lang].signIn}
              </>
            )}
          </button>
          
          <div className="bg-emerald-50/50 dark:bg-emerald-900/20 p-4 rounded-2xl flex items-start gap-3 text-sm text-emerald-800 dark:text-emerald-300 text-left font-medium border border-emerald-100/50 dark:border-emerald-800/50 transition-colors">
            <AlertCircle className="w-5 h-5 text-emerald-500 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
            <p className={lang === 'ar' ? 'text-right' : 'text-left'}>At first run, you will need to grant permissions for Google Sheets, Drive, Gmail, and Calendar to enable full functionality.</p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!spreadsheetId) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-6 transition-colors" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button onClick={toggleTheme} className="flex items-center justify-center bg-white dark:bg-gray-800 p-2 rounded-full shadow-sm text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 transition-colors">
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-indigo-500" />}
          </button>
          <button onClick={toggleLang} className="flex items-center gap-2 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-full shadow-sm text-sm font-bold text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 transition-colors">
            <Globe className="w-4 h-4 text-emerald-600" />
            {lang === 'ar' ? 'English' : 'العربية'}
          </button>
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 p-8 text-center flex flex-col gap-6 transition-colors">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight transition-colors">{t[lang].connectNewSheet}</h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium transition-colors">{t[lang].connectDesc}</p>
          </div>
          
          <div className="space-y-4">
            <button 
              onClick={handleCreateSheet}
              disabled={isCreating}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2"
            >
              {isCreating ? t[lang].creating : `✨ ${t[lang].createNewSheet}`}
            </button>
            
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-gray-200 dark:border-gray-700 transition-colors"></div>
              <span className="flex-shrink-0 mx-4 text-gray-400 dark:text-gray-500 text-sm font-medium transition-colors">OR</span>
              <div className="flex-grow border-t border-gray-200 dark:border-gray-700 transition-colors"></div>
            </div>

            <button 
              onClick={() => {
                showDrivePicker((selectedSheetId) => {
                  setSpreadsheetId(selectedSheetId);
                  localStorage.setItem('spreadsheetId', selectedSheetId);
                });
              }}
              className="w-full flex items-center justify-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-emerald-200 dark:hover:border-emerald-700 text-gray-700 dark:text-gray-200 font-bold py-3.5 px-4 rounded-xl transition-all shadow-sm"
            >
              <FileSearch className="w-5 h-5 text-emerald-600" />
              <span>{t[lang].browseDrive}</span>
            </button>
          </div>
          
          <button onClick={logout} className="text-sm font-bold text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            {t[lang].signOut}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex justify-center w-full h-[100dvh] bg-gray-100/50 dark:bg-gray-950/50 transition-colors" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Mobile App Container */}
      <div className="w-full max-w-md bg-gray-50 dark:bg-gray-950 h-[100dvh] flex flex-col relative shadow-2xl overflow-hidden transition-colors">
        
        {/* Top App Bar */}
        <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-4 py-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md shadow-emerald-600/20">
              <Car className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white transition-colors">AutoTracker</h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="text-gray-400 dark:text-gray-500 hover:text-emerald-600 dark:hover:text-emerald-500 p-2 rounded-full transition-colors flex items-center justify-center">
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button onClick={toggleLang} className="text-gray-400 dark:text-gray-500 hover:text-emerald-600 dark:hover:text-emerald-500 p-2 rounded-full transition-colors flex items-center justify-center">
               <Globe className="w-5 h-5" />
            </button>
            <a 
              href={`https://docs.google.com/spreadsheets/d/${spreadsheetId}`} 
              target="_blank" 
              rel="noreferrer" 
              className="text-gray-400 dark:text-gray-500 hover:text-emerald-600 dark:hover:text-emerald-500 p-2 rounded-full transition-colors"
              title="Open Google Sheets"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </header>
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto pb-24">
          <AnimatePresence mode="wait">
            {activeTab === 'home' ? (
              <motion.div key="home" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="h-full">
                <Dashboard spreadsheetId={spreadsheetId} userEmail={user?.email || ''} lang={lang} />
              </motion.div>
            ) : (
              <motion.div key="settings" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-6 flex flex-col gap-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">{t[lang].appSettings}</h2>
                
                <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col gap-4 transition-colors">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2 transition-colors">Spreadsheet ID</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 break-all bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700 transition-colors" dir="ltr">
                      {spreadsheetId}
                    </p>
                  </div>
                  <a 
                    href={`https://docs.google.com/spreadsheets/d/${spreadsheetId}`} 

                    target="_blank" 
                    rel="noreferrer" 
                    className="text-center bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-bold py-2.5 rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
                  >
                    Open in Google Sheets
                  </a>
                </div>

                <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col gap-4 transition-colors">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1 transition-colors">{t[lang].connectNewSheet}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 transition-colors">{t[lang].connectDesc}</p>
                  </div>
                  <button 
                    onClick={() => {
                      showDrivePicker((selectedSheetId) => {
                        setSpreadsheetId(selectedSheetId);
                        localStorage.setItem('spreadsheetId', selectedSheetId);
                        setActiveTab('home');
                      });
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-gray-900 dark:bg-gray-800 hover:bg-black dark:hover:bg-gray-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md"
                  >
                    <FileSearch className="w-5 h-5" />
                    <span>{t[lang].browseDrive}</span>
                  </button>
                </div>
                
                <button 
                  onClick={() => {
                    setSpreadsheetId('');
                    localStorage.removeItem('spreadsheetId');
                    setActiveTab('home');
                  }}
                  className="w-full bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 font-bold py-4 rounded-xl transition-colors mt-4"
                >
                  Disconnect Sheet
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
        
        {/* Bottom Navigation */}
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 absolute bottom-0 left-0 w-full flex items-center justify-around pb-6 pt-3 px-2 z-50 shadow-[0_-8px_16px_-4px_rgba(0,0,0,0.05)] dark:shadow-[0_-8px_16px_-4px_rgba(0,0,0,0.4)] transition-colors">
          <button 
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 p-2 transition-colors ${activeTab === 'home' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'}`}
          >
            <Car className="w-6 h-6" />
            <span className="text-[10px] font-bold">{t[lang].home}</span>
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center gap-1 p-2 transition-colors ${activeTab === 'settings' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'}`}
          >
            <Settings className="w-6 h-6" />
            <span className="text-[10px] font-semibold">{t[lang].settings}</span>
          </button>
          <button 
            onClick={logout}
            className="flex flex-col items-center gap-1 p-2 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
          >
            <LogIn className="w-6 h-6 rotate-180" />
            <span className="text-[10px] font-semibold">{t[lang].signOut}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
