import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

let configJson: any = {};
try {
  configJson = require('../../../../firebaseConfig.json');
} catch (e) {
  // Optional local config file
}

export const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || configJson.apiKey || '',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || configJson.authDomain || '',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || configJson.projectId || '',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || configJson.storageBucket || '',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || configJson.messagingSenderId || '',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || configJson.appId || '',
};

export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

let authInstance: Auth;
try {
  const firebaseAuthModule = require('firebase/auth') as any;
  if (typeof firebaseAuthModule.getReactNativePersistence === 'function') {
    authInstance = initializeAuth(app, {
      persistence: firebaseAuthModule.getReactNativePersistence(AsyncStorage),
    });
  } else {
    authInstance = getAuth(app);
  }
} catch (e) {
  authInstance = getAuth(app);
}

export const auth = authInstance;
export const db: Firestore = getFirestore(app);
