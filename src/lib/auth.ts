import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { Linking } from 'react-native';
import { storage } from './storage';
import { AuthUser } from '../types';
import firebaseConfig from '../../firebase-applet-config.json';

WebBrowser.maybeCompleteAuthSession();

// Google OAuth configuration
const CLIENT_ID = firebaseConfig.oAuthClientId || '867501694584-oe8lrngvfils3a2mbsi130btl1u0qkt9.apps.googleusercontent.com';

const SCOPES = [
  'openid',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.metadata.readonly',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/calendar.events'
];

let cachedToken: string | null = null;
let cachedUser: AuthUser | null = null;

export const getAccessToken = async (): Promise<string | null> => {
  if (cachedToken) return cachedToken;
  cachedToken = await storage.getAuthToken();
  return cachedToken;
};

export const getStoredUser = async (): Promise<AuthUser | null> => {
  if (cachedUser) return cachedUser;
  cachedUser = await storage.getAuthUser();
  return cachedUser;
};

export const fetchGoogleUserInfo = async (accessToken: string): Promise<AuthUser> => {
  const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch user info');
  }
  const data = await response.json();
  return {
    id: data.sub,
    name: data.name,
    email: data.email,
    picture: data.picture,
  };
};

function extractParamsFromUrl(url: string): { code?: string; accessToken?: string; error?: string } {
  try {
    const queryString = url.includes('?') ? url.split('?')[1].split('#')[0] : '';
    const hashString = url.includes('#') ? url.split('#')[1] : '';

    const queryParams = new URLSearchParams(queryString);
    const hashParams = new URLSearchParams(hashString);

    const code = queryParams.get('code') || hashParams.get('code') || undefined;
    const accessToken = queryParams.get('access_token') || hashParams.get('access_token') || undefined;
    const error = queryParams.get('error') || hashParams.get('error') || undefined;

    return { code, accessToken, error };
  } catch {
    return {};
  }
}

export const signInWithGoogle = async (): Promise<{ token: string; user: AuthUser } | null> => {
  try {
    const clientIdPrefix = CLIENT_ID.replace('.apps.googleusercontent.com', '');
    const scheme = `com.googleusercontent.apps.${clientIdPrefix}`;

    const redirectUri = AuthSession.makeRedirectUri({
      scheme,
      path: 'oauthredirect',
      native: `${scheme}:/oauthredirect`,
    });

    const discovery = {
      authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenEndpoint: 'https://oauth2.googleapis.com/token',
      revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
    };

    const request = new AuthSession.AuthRequest({
      clientId: CLIENT_ID,
      scopes: SCOPES,
      redirectUri,
      responseType: AuthSession.ResponseType.Code,
      usePKCE: true,
    });

    await request.getAuthRequestConfigAsync();
    const authUrl = await request.makeAuthUrlAsync(discovery);

    let redirectUrl: string | null = null;
    let linkingSubscription: any = null;

    const linkingPromise = new Promise<string>((resolve) => {
      linkingSubscription = Linking.addEventListener('url', (event) => {
        if (event.url && (event.url.includes('code=') || event.url.includes('error='))) {
          resolve(event.url);
        }
      });
    });

    const webBrowserPromise = WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

    const raceResult = await Promise.race([
      webBrowserPromise.then((res) => ({ source: 'browser' as const, res })),
      linkingPromise.then((url) => ({ source: 'linking' as const, url })),
    ]);

    if (raceResult.source === 'linking') {
      redirectUrl = raceResult.url;
      try {
        WebBrowser.dismissAuthSession();
      } catch {}
    } else {
      const browserRes = raceResult.res;
      if (browserRes.type === 'success' && browserRes.url) {
        redirectUrl = browserRes.url;
      }
    }

    if (linkingSubscription) {
      linkingSubscription.remove();
    }

    // Fallback: Check initial URL if browser was dismissed or closed by Android intent
    if (!redirectUrl) {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl && (initialUrl.includes('code=') || initialUrl.includes('error='))) {
        redirectUrl = initialUrl;
      }
    }

    if (!redirectUrl) {
      return null;
    }

    const { code, accessToken: initialAccessToken, error } = extractParamsFromUrl(redirectUrl);

    if (error) {
      throw new Error(`Google Authentication Error: ${error}`);
    }

    let accessToken = initialAccessToken;

    if (!accessToken && code) {
      const response = await fetch(discovery.tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: CLIENT_ID,
          code,
          redirect_uri: redirectUri,
          code_verifier: request.codeVerifier || '',
        }).toString(),
      });

      const tokenData = await response.json();

      if (!response.ok || tokenData.error) {
        throw new Error(
          tokenData.error_description || tokenData.error || `Token exchange failed with status ${response.status}`
        );
      }

      accessToken = tokenData.access_token;
    }

    if (accessToken) {
      cachedToken = accessToken;
      await storage.setAuthToken(accessToken);

      const userInfo = await fetchGoogleUserInfo(accessToken);
      cachedUser = userInfo;
      await storage.setAuthUser(userInfo);

      return { token: accessToken, user: userInfo };
    }

    return null;
  } catch (error) {
    console.error('Google Sign In Error:', error);
    throw error;
  }
};

export const signOut = async (): Promise<void> => {
  cachedToken = null;
  cachedUser = null;
  await storage.removeAuthToken();
  await storage.removeAuthUser();
};
