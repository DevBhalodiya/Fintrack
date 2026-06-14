import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBkCelB_0_6Yc4ZqWH7ihEy2mc6fgKwGos",
  authDomain: "fintreak.firebaseapp.com",
  projectId: "fintreak",
  storageBucket: "fintreak.firebasestorage.app",
  messagingSenderId: "1003429311560",
  appId: "1:1003429311560:web:abadf8134d226a9ce7d47d",
  measurementId: "G-7GFYF9P34M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
