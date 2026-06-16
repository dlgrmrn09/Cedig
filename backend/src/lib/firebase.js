import admin from 'firebase-admin';
import config from '../config/index.js';

let firebaseApp;

function initializeFirebase() {
  if (firebaseApp) return firebaseApp;

  if (config.firebase.projectId && config.firebase.clientEmail && config.firebase.privateKey) {
    try {
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: config.firebase.projectId,
          clientEmail: config.firebase.clientEmail,
          privateKey: config.firebase.privateKey,
        }),
      });
      console.log('Firebase Admin SDK initialized');
    } catch (err) {
      console.warn('Firebase Admin SDK initialization failed:', err.message);
      console.warn('Running in development mode without Firebase Auth verification.');
      firebaseApp = null;
    }
  } else {
    console.warn('Firebase credentials not configured. Auth verification will use dev fallback.');
    firebaseApp = null;
  }

  return firebaseApp;
}

initializeFirebase();

export default admin;
export { firebaseApp };
