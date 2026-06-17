const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '';
const RECAPTCHA_SCRIPT_URL = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;

let scriptLoaded = false;
let scriptLoading = false;
let grecaptchaInstance: typeof window.grecaptcha | null = null;

declare global {
  interface Window {
    grecaptcha: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
    __recaptchaReadyCallbacks?: Array<() => void>;
  }
}

function loadScript(): Promise<void> {
  if (scriptLoaded) return Promise.resolve();
  if (scriptLoading) {
    return new Promise((resolve) => {
      if (!window.__recaptchaReadyCallbacks) {
        window.__recaptchaReadyCallbacks = [];
      }
      window.__recaptchaReadyCallbacks.push(resolve);
    });
  }

  scriptLoading = true;

  return new Promise((resolve, reject) => {
    if (!RECAPTCHA_SITE_KEY) {
      console.warn('[reCAPTCHA] Site key not configured. reCAPTCHA is disabled.');
      scriptLoaded = true;
      scriptLoading = false;
      return resolve();
    }

    const existing = document.querySelector(`script[src="${RECAPTCHA_SCRIPT_URL}"]`);
    if (existing) {
      scriptLoaded = true;
      scriptLoading = false;
      if (window.grecaptcha) {
        grecaptchaInstance = window.grecaptcha;
        window.grecaptcha.ready(resolve);
      } else {
        resolve();
      }
      return;
    }

    const script = document.createElement('script');
    script.src = RECAPTCHA_SCRIPT_URL;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      scriptLoaded = true;
      scriptLoading = false;
      grecaptchaInstance = window.grecaptcha;
      window.grecaptcha.ready(() => {
        resolve();
        if (window.__recaptchaReadyCallbacks) {
          window.__recaptchaReadyCallbacks.forEach((cb) => cb());
          delete window.__recaptchaReadyCallbacks;
        }
      });
    };

    script.onerror = () => {
      scriptLoading = false;
      console.error('[reCAPTCHA] Failed to load script');
      reject(new Error('RECAPTCHA_LOAD_ERROR'));
    };

    document.head.appendChild(script);
  });
}

export async function executeRecaptcha(action: string): Promise<string> {
  if (!RECAPTCHA_SITE_KEY) {
    console.warn('[reCAPTCHA] Site key not configured. Returning empty token.');
    return '';
  }

  try {
    await loadScript();
  } catch {
    throw new Error('RECAPTCHA_LOAD_FAILED');
  }

  if (!grecaptchaInstance) {
    throw new Error('RECAPTCHA_NOT_READY');
  }

  try {
    const token = await grecaptchaInstance.execute(RECAPTCHA_SITE_KEY, { action });
    return token;
  } catch (error) {
    console.error('[reCAPTCHA] Token generation failed:', error);
    throw new Error('RECAPTCHA_EXECUTION_FAILED');
  }
}

export function getRecaptchaSiteKey(): string {
  return RECAPTCHA_SITE_KEY;
}

export function isRecaptchaConfigured(): boolean {
  return !!RECAPTCHA_SITE_KEY;
}
