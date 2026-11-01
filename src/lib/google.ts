/**
 * Real Google sign-in (Google Identity Services, OAuth popup).
 * Needs NEXT_PUBLIC_GOOGLE_CLIENT_ID. The returned access token is verified by the backend.
 */

const CLIENT_ID: string = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
const SCRIPT_SRC = 'https://accounts.google.com/gsi/client';

export const isGoogleConfigured = Boolean(CLIENT_ID);

const getGoogle = () => (window as any).google;

/** Load the Google script early so the popup can open instantly on click. */
export function preloadGoogleScript(): void {
  if (!isGoogleConfigured || typeof document === 'undefined') return;
  if (document.querySelector(`script[src="${SCRIPT_SRC}"]`)) return;
  const script = document.createElement('script');
  script.src = SCRIPT_SRC;
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
}

/** Opens the real Google account chooser. Call it directly from a click handler. */
export function requestGoogleAccessToken(): Promise<string> {
  return new Promise((resolve, reject) => {
    const oauth2 = getGoogle()?.accounts?.oauth2;
    if (!oauth2) {
      preloadGoogleScript();
      reject(new Error('Google is still loading, please try again in a moment'));
      return;
    }
    const client = oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: 'openid email profile',
      callback: (resp: any) => {
        if (resp?.error || !resp?.access_token) {
          reject(new Error(resp?.error_description || 'Google sign-in failed'));
        } else {
          resolve(resp.access_token);
        }
      },
      error_callback: (err: any) => {
        reject(new Error(err?.type === 'popup_closed' ? 'Google sign-in was cancelled' : 'Google sign-in failed'));
      },
    });
    client.requestAccessToken();
  });
}
