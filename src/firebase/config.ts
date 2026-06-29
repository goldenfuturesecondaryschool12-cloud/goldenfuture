import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyATdU6K4AfmDo44Fwa-VvEcPeEJlWUTAi0",
  authDomain: "golden-future-b58c8.firebaseapp.com",
  projectId: "golden-future-b58c8",
  storageBucket: "golden-future-b58c8.firebasestorage.app",
  messagingSenderId: "801164161488",
  appId: "1:801164161488:web:eda0d1083f018479f989d5",
  measurementId: "G-C5142354RV"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
