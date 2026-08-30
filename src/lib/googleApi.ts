import { getAccessToken, logout } from './firebase';

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated');

  const headers = new Headers(options.headers || {});
  headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    if (response.status === 401) {
      await logout();
      window.location.reload();
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
// Drive API (Receipts)
// ========================
export async function uploadReceipt(file: File, folderId?: string) {
  const metadata = {
    name: file.name,
    parents: folderId ? [folderId] : [],
  };

  const formData = new FormData();
  formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  formData.append('file', file);

  const res = await fetchWithAuth('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink', {
    method: 'POST',
    body: formData,
  });
  return res.json();
}

export async function createFolder(name: string) {
  const metadata = {
    name,
    mimeType: 'application/vnd.google-apps.folder',
  };

  const res = await fetchWithAuth('https://www.googleapis.com/drive/v3/files?fields=id', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(metadata),
  });
  return res.json();
}

// ========================
// Gmail API
// ========================
export async function sendEmail(to: string, subject: string, body: string) {
  const email = [
    `To: ${to}`,
    'Content-type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    `Subject: =?utf-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`,
    '',
    body,
  ].join('\r\n');

  const encodedEmail = btoa(email).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

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
