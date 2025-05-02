import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration and initialization
// We use environment variables with fallbacks to default values
// This allows the app to work in development without exposing secrets in the repo
import type { FirebaseApp } from "firebase/app";
import type { Auth } from "firebase/auth";
import type { Firestore } from "firebase/firestore";

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;

function isBrowser() {
  return typeof window !== "undefined";
}

// Note: We're using hardcoded values for development
// In a production environment, these should be moved to environment variables

export function getFirebase() {
  // Initialize Firebase for both browser and server environments
  if (!app) {
    // Use environment variables with fallbacks to default values
    // This approach works in both development and production
    // For production, set these environment variables in your hosting platform
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBCEK1mHTrONx1S-oQH6Wmq5vZDhp5gCxM",
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "gorlea-todo-list.firebaseapp.com",
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "gorlea-todo-list",
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "gorlea-todo-list.appspot.com",
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "5433701257",
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:5433701257:web:35aae6ccb2d7d064a8dee8",
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-ZX5DH3K2D"
    };

    try {
      // Initialize Firebase
      app = initializeApp(firebaseConfig);

      // Only initialize auth in browser environment
      if (isBrowser()) {
        auth = getAuth(app);
      }

      // Initialize Firestore for both environments
      db = getFirestore(app);

      console.log('Firebase initialized successfully.');
    } catch (error) {
      console.error('Error initializing Firebase:', error);
    }
  }
  return { app, auth, db };
}
