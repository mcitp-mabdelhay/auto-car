import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser, Language, ThemeMode } from '../types';
import { storage } from '../lib/storage';
import { getAccessToken, getStoredUser, signInWithGoogle, signOut as authSignOut } from '../lib/auth';
import { t } from '../locales';

interface AppContextType {
  user: AuthUser | null;
  token: string | null;
  spreadsheetId: string;
  lang: Language;
  theme: ThemeMode;
  activeTab: 'home' | 'settings';
  isLoadingAuth: boolean;
  strings: typeof t.ar;
  isRTL: boolean;
  login: () => Promise<boolean>;
  logout: () => Promise<void>;
  updateSpreadsheetId: (id: string) => Promise<void>;
  toggleLang: () => Promise<void>;
  toggleTheme: () => Promise<void>;
  setActiveTab: (tab: 'home' | 'settings') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [spreadsheetId, setSpreadsheetId] = useState<string>('');
  const [lang, setLangState] = useState<Language>('ar');
  const [theme, setThemeState] = useState<ThemeMode>('light');
  const [activeTab, setActiveTab] = useState<'home' | 'settings'>('home');
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);

  useEffect(() => {
    async function init() {
      try {
        const [savedToken, savedUser, savedSheetId, savedLang, savedTheme] = await Promise.all([
          getAccessToken(),
          getStoredUser(),
          storage.getSpreadsheetId(),
          storage.getLang(),
          storage.getTheme(),
        ]);

        if (savedToken) setToken(savedToken);
        if (savedUser) setUser(savedUser);
        if (savedSheetId) setSpreadsheetId(savedSheetId);
        if (savedLang) setLangState(savedLang);
        if (savedTheme) setThemeState(savedTheme);
      } catch (e) {
        console.error('Error initializing app state:', e);
      } finally {
        setIsLoadingAuth(false);
      }
    }
    init();
  }, []);

  const login = async (): Promise<boolean> => {
    try {
      const result = await signInWithGoogle();
      if (result) {
        setToken(result.token);
        setUser(result.user);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Login failed', e);
      throw e;
    }
  };

  const logout = async () => {
    await authSignOut();
    setToken(null);
    setUser(null);
  };

  const updateSpreadsheetId = async (id: string) => {
    setSpreadsheetId(id);
    if (id) {
      await storage.setSpreadsheetId(id);
    } else {
      await storage.removeSpreadsheetId();
    }
  };

  const toggleLang = async () => {
    const nextLang: Language = lang === 'ar' ? 'en' : 'ar';
    setLangState(nextLang);
    await storage.setLang(nextLang);
  };

  const toggleTheme = async () => {
    const nextTheme: ThemeMode = theme === 'light' ? 'dark' : 'light';
    setThemeState(nextTheme);
    await storage.setTheme(nextTheme);
  };

  const isRTL = lang === 'ar';
  const strings = t[lang];

  return (
    <AppContext.Provider
      value={{
        user,
        token,
        spreadsheetId,
        lang,
        theme,
        activeTab,
        isLoadingAuth,
        strings,
        isRTL,
        login,
        logout,
        updateSpreadsheetId,
        toggleLang,
        toggleTheme,
        setActiveTab,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
