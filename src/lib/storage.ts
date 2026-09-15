import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language, ThemeMode } from '../types';

const KEYS = {
  SPREADSHEET_ID: '@autotracker_spreadsheet_id',
  LANG: '@autotracker_lang',
  THEME: '@autotracker_theme',
  AUTH_TOKEN: '@autotracker_auth_token',
  AUTH_USER: '@autotracker_auth_user',
};

export const storage = {
  async getSpreadsheetId(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(KEYS.SPREADSHEET_ID);
    } catch {
      return null;
    }
  },

  async setSpreadsheetId(id: string): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.SPREADSHEET_ID, id);
    } catch (e) {
      console.error('Failed to save spreadsheetId:', e);
    }
  },

  async removeSpreadsheetId(): Promise<void> {
    try {
      await AsyncStorage.removeItem(KEYS.SPREADSHEET_ID);
    } catch (e) {
      console.error('Failed to remove spreadsheetId:', e);
    }
  },

  async getLang(): Promise<Language> {
    try {
      const val = await AsyncStorage.getItem(KEYS.LANG);
      return (val as Language) || 'ar';
    } catch {
      return 'ar';
    }
  },

  async setLang(lang: Language): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.LANG, lang);
    } catch (e) {
      console.error('Failed to save lang:', e);
    }
  },

  async getTheme(): Promise<ThemeMode> {
    try {
      const val = await AsyncStorage.getItem(KEYS.THEME);
      return (val as ThemeMode) || 'light';
    } catch {
      return 'light';
    }
  },

  async setTheme(theme: ThemeMode): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.THEME, theme);
    } catch (e) {
      console.error('Failed to save theme:', e);
    }
  },

  async getAuthToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(KEYS.AUTH_TOKEN);
    } catch {
      return null;
    }
  },

  async setAuthToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.AUTH_TOKEN, token);
    } catch (e) {
      console.error('Failed to save auth token:', e);
    }
  },

  async removeAuthToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(KEYS.AUTH_TOKEN);
    } catch (e) {
      console.error('Failed to remove auth token:', e);
    }
  },

  async getAuthUser(): Promise<any | null> {
    try {
      const val = await AsyncStorage.getItem(KEYS.AUTH_USER);
      return val ? JSON.parse(val) : null;
    } catch {
      return null;
    }
  },

  async setAuthUser(user: any): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.AUTH_USER, JSON.stringify(user));
    } catch (e) {
      console.error('Failed to save auth user:', e);
    }
  },

  async removeAuthUser(): Promise<void> {
    try {
      await AsyncStorage.removeItem(KEYS.AUTH_USER);
    } catch (e) {
      console.error('Failed to remove auth user:', e);
    }
  }
};
