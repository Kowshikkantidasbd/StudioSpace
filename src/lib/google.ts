

const CLIENT_ID: string = process.env.GOOGLE_CLIENT_ID || '';
const SCRIPT_SRC = 'https://accounts.google.com/gsi/client';

export const isGoogleConfigured = Boolean(CLIENT_ID);

const getGoogle = () => (window as any).google;


export function preloadGoogleScript(): void {
  if (!isGoogleConfigured || typeof document === 'undefined') return;
  if (document.querySelector(`script[src="${SCRIPT_SRC}"]`)) return;
  const script = document.createElement('script');
  script.src = SCRIPT_SRC;
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
}


export function requestGoogleAccessToken(): Promise<string> {
  return new Promise((resolve, reject) => {
    const attempt = () => {
      const oauth2 = getGoogle()?.accounts?.oauth2;
      if (!oauth2) {
        preloadGoogleScript();
        
        
        const start = Date.now();
        const poll = () => {
          if (getGoogle()?.accounts?.oauth2) {
            attempt();
            return;
          }
          if (Date.now() - start > 15000) {
            reject(new Error('Google sign-in is taking too long. Please try again.'));
            return;
          }
          setTimeout(poll, 200);
        };
        poll();
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
    };
    attempt();
  });
}