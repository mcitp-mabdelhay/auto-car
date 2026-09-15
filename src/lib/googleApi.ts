import { getAccessToken, signOut } from './auth';
import * as FileSystem from 'expo-file-system';
import { GoogleDriveFile } from '../types';

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated');

  const headers = new Headers(options.headers || {});
  headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    if (response.status === 401) {
      await signOut();
    }
    const errorText = await response.text();
    throw new Error(`Google API error: ${response.status} ${response.statusText} - ${errorText}`);
  }
  return response;
}

// ========================
// Sheets API
// ========================
export async function createSpreadsheet(title: string) {
  const res = await fetchWithAuth('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      properties: { title }
    }),
  });
  return res.json();
}

export async function getSpreadsheet(spreadsheetId: string) {
  const res = await fetchWithAuth(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`);
  return res.json();
}

export async function getSheetValues(spreadsheetId: string, range: string) {
  const res = await fetchWithAuth(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`);
  return res.json();
}

export async function updateSheetValues(spreadsheetId: string, range: string, values: any[][]) {
  const res = await fetchWithAuth(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ values }),
    }
  );
  return res.json();
}

export async function appendSheetValues(spreadsheetId: string, range: string, values: any[][]) {
  const res = await fetchWithAuth(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=USER_ENTERED`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ values }),
    }
  );
  return res.json();
}

// ========================
// Drive API (Search Spreadsheets for Native Picker)
// ========================
export async function listSpreadsheets(): Promise<GoogleDriveFile[]> {
  const query = encodeURIComponent("mimeType='application/vnd.google-apps.spreadsheet' and trashed=false");
  const url = `https://www.googleapis.com/drive/v3/files?q=${query}&orderBy=modifiedTime desc&pageSize=30&fields=files(id,name,modifiedTime)`;
  
  const res = await fetchWithAuth(url);
  const data = await res.json();
  return data.files || [];
}

// ========================
// Drive API (Receipts Upload from File URI)
// ========================
export async function uploadReceipt(
  fileUri: string, 
  fileName: string = 'receipt.jpg', 
  mimeType: string = 'image/jpeg',
  folderId?: string
) {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated');

  const metadata = {
    name: fileName,
    parents: folderId ? [folderId] : [],
  };

  // Read the file as base64
  const base64Data = await FileSystem.readAsStringAsync(fileUri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    `Content-Type: ${mimeType}\r\n` +
    'Content-Transfer-Encoding: base64\r\n\r\n' +
    base64Data +
    closeDelimiter;

  const res = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body: multipartRequestBody,
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to upload to Google Drive: ${err}`);
  }

  return res.json();
}

// ========================
// Helper for UTF-8 Base64 encoding (Hermes-compatible)
// ========================
function utf8ToBase64(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  // Standard btoa encoding
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  let encoded = '';
  for (let i = 0; i < binary.length; i += 3) {
    const a = binary.charCodeAt(i);
    const b = binary.charCodeAt(i + 1);
    const c = binary.charCodeAt(i + 2);
    const n = (a << 16) | (b << 8) | (isNaN(b) ? 0 : c);
    encoded += chars.charAt((n >> 18) & 63);
    encoded += chars.charAt((n >> 12) & 63);
    encoded += isNaN(b) ? '=' : chars.charAt((n >> 6) & 63);
    encoded += isNaN(c) || isNaN(b) ? '=' : chars.charAt(n & 63);
  }
  return encoded;
}

// ========================
// Gmail API
// ========================
export async function sendEmail(to: string, subject: string, body: string) {
  const subjectEncoded = `=?utf-8?B?${utf8ToBase64(subject)}?=`;

  const emailLines = [
    `To: ${to}`,
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    `Subject: ${subjectEncoded}`,
    '',
    body,
  ];

  const fullEmail = emailLines.join('\r\n');
  const encodedEmail = utf8ToBase64(fullEmail)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const res = await fetchWithAuth('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ raw: encodedEmail }),
  });
  return res.json();
}

// ========================
// Calendar API
// ========================
export async function createCalendarEvent(summary: string, description: string, date: string) {
  const event = {
    summary,
    description,
    start: { date },
    end: { date },
  };

  const res = await fetchWithAuth('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event),
  });
  return res.json();
}
