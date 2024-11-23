import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import Constants from 'expo-constants';

const firebaseConfig = {
    apiKey: "AIzaSyAW0KwZWSYWA4qIORW3H3idl2O6H_r4DWg",
    authDomain: "mobil-31aa7.firebaseapp.com",
    projectId: "mobil-31aa7",
    storageBucket: "mobil-31aa7.firebasestorage.app",
    messagingSenderId: "100898415383",
    appId: "1:100898415383:web:cfeeea5597c57a26ad8d52",
    measurementId: "G-WBJJN40MYE"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);