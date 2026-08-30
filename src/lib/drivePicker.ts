import { getAccessToken } from './firebase';

let isPickerLoaded = false;

export const loadDrivePickerScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (isPickerLoaded) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = () => {
      (window as any).gapi.load('picker', {
        callback: () => {
          isPickerLoaded = true;
          resolve();
        }
      });
    };
    script.onerror = () => reject(new Error('Failed to load Google Picker API script'));
    document.body.appendChild(script);
  });
};

export const showDrivePicker = async (onSelect: (sheetId: string) => void) => {
  try {
    await loadDrivePickerScript();
    const token = await getAccessToken();
    if (!token) {
      throw new Error("No access token available for Drive Picker");
    }

    const google = (window as any).google;
    const view = new google.picker.DocsView(google.picker.ViewId.SPREADSHEETS);
    view.setMimeTypes('application/vnd.google-apps.spreadsheet');
    
    const pickerOrigin =
      window.location.ancestorOrigins &&
      window.location.ancestorOrigins.length > 0
        ? window.location.ancestorOrigins[
            window.location.ancestorOrigins.length - 1
          ]
        : window.location.origin;

    const picker = new google.picker.PickerBuilder()
      .enableFeature(google.picker.Feature.NAV_HIDDEN)
      .setOAuthToken(token)
      .addView(view)
      .setOrigin(pickerOrigin)
      .setCallback((data: any) => {
        if (data.action === google.picker.Action.PICKED) {
          const doc = data.docs[0];
          onSelect(doc.id);
        }
      })
      .build();

    picker.setVisible(true);
  } catch (error) {
    console.error("Error displaying Drive Picker:", error);
    alert('Failed to open Drive Picker. Make sure you are authenticated.');
  }
};
