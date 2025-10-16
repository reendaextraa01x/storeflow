import { initializeApp, getApps, getApp, type FirebaseOptions } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// A function to check if all required environment variables are present.
const areFirebaseVarsPresent = () => {
    return (
        firebaseConfig.apiKey &&
        firebaseConfig.authDomain &&
        firebaseConfig.projectId &&
        firebaseConfig.storageBucket &&
        firebaseConfig.messagingSenderId &&
        firebaseConfig.appId
    );
};

// Initialize Firebase only if the variables are set.
const app = areFirebaseVarsPresent() && !getApps().length ? initializeApp(firebaseConfig) : (getApps().length ? getApp() : null);

// Throw a more descriptive error if Firebase isn't configured.
if (!app) {
    throw new Error(
      'Firebase is not configured. Please add your Firebase project credentials to the .env.local file. You can find the instructions in the README.md file.'
    );
}


const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
