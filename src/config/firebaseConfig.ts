// src/config/firebaseConfig.ts

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, Timestamp } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions"; // 🔥 ADD THIS IMPORT

// TODO: Replace this with your actual Firebase config object
const firebaseConfig = {
  apiKey: "AIzaSyCoT-W57CTegFRFu2_7FrRYIK5l9wH1_hY",
  authDomain: "gen-ai-475305.firebaseapp.com",
  projectId: "gen-ai-475305",
  storageBucket: "gen-ai-475305.firebasestorage.app",
  messagingSenderId: "828452238671",
  appId: "1:828452238671:web:110c382ecb65bedfcac13a",
  measurementId: "G-RTKZ4YKVDF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// --- YOU ARE MISSING THESE LINES ---
// Create and export the services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app); // 🔥 ADD THIS EXPORT
export { Timestamp };