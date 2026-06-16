import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  onIdTokenChanged,
  EmailAuthProvider,
  reauthenticateWithCredential,
  PhoneAuthProvider,
  linkWithCredential,
  updateEmail as firebaseUpdateEmail,
  verifyBeforeUpdateEmail,
  type User as FirebaseUser,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.error('[FIREBASE] Failed to set persistence:', err);
});

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export async function loginWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  const token = await result.user.getIdToken();
  return { user: result.user, token };
}

export async function loginWithFacebook() {
  const result = await signInWithPopup(auth, facebookProvider);
  const token = await result.user.getIdToken();
  return { user: result.user, token };
}

export async function loginWithEmail(email: string, password: string) {
  const result = await signInWithEmailAndPassword(auth, email, password);
  const token = await result.user.getIdToken();
  return { user: result.user, token };
}

export async function registerWithEmail(email: string, password: string) {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  const token = await result.user.getIdToken();
  return { user: result.user, token };
}

export async function sendVerificationEmail(user: FirebaseUser) {
  await sendEmailVerification(user);
}

export async function sendResetPasswordEmail(email: string) {
  await sendPasswordResetEmail(auth, email);
}

export async function reauthenticate(email: string, password: string) {
  const user = auth.currentUser;
  if (!user) throw new Error('No authenticated user');
  const credential = EmailAuthProvider.credential(email, password);
  const result = await reauthenticateWithCredential(user, credential);
  return result;
}

export async function changeFirebaseEmail(newEmail: string) {
  const user = auth.currentUser;
  if (!user) throw new Error('No authenticated user');
  await firebaseUpdateEmail(user, newEmail);
}

export async function verifyThenUpdateEmail(newEmail: string) {
  const user = auth.currentUser;
  if (!user) throw new Error('No authenticated user');
  await verifyBeforeUpdateEmail(user, newEmail);
}

export async function logout() {
  await signOut(auth);
}

export function onAuthChange(callback: (user: FirebaseUser | null) => void) {
  return onIdTokenChanged(auth, async (user) => {
    if (user) {
      const token = await user.getIdToken();
      (user as FirebaseUser & { token: string }).token = token;
    }
    callback(user);
  });
}

export function onAuthStateChange(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export async function getIdToken(): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) return null;
  return user.getIdToken();
}

export async function getFreshToken(): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) return null;

  try {
    const token = await user.getIdToken(true);
    console.log('[FIREBASE] Fresh token obtained');
    return token;
  } catch (err) {
    console.error('[FIREBASE] Failed to refresh token:', err);
    return null;
  }
}

export async function ensureFreshToken(): Promise<string | null> {
  const stored = localStorage.getItem('cedig_token');
  if (stored) {
    try {
      const payload = JSON.parse(atob(stored.split('.')[1]));
      const expiry = payload.exp * 1000;
      const now = Date.now();
      if (now < expiry - 300000) {
        return stored;
      }
    } catch {
      // invalid token format, will refresh below
    }
  }

  const freshToken = await getFreshToken();
  if (freshToken) {
    localStorage.setItem('cedig_token', freshToken);
  }
  return freshToken;
}

export async function waitForAuthReady(): Promise<FirebaseUser | null> {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      console.log('[FIREBASE] Auth ready', { uid: user?.uid, email: user?.email });
      resolve(user);
    });
  });
}

export {
  auth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  EmailAuthProvider,
  PhoneAuthProvider,
  linkWithCredential,
};
export type { FirebaseUser };
