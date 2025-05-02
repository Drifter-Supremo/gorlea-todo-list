import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Note: For a production application, we would validate environment variables here
// and use them instead of hardcoded values. For this prototype, we're using
// hardcoded values for simplicity and development purposes.

// Firebase configuration and initialization
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
    // We're using hardcoded values for development
    // This is a simplified approach for the prototype

    // Use hardcoded values for development, but in a secure way for production
    const firebaseConfig = {
      apiKey: "AIzaSyBCEK1mHTrONx1S-oQH6Wmq5vZDhp5gCxM",
      authDomain: "gorlea-todo-list.firebaseapp.com",
      projectId: "gorlea-todo-list",
      storageBucket: "gorlea-todo-list.appspot.com",
      messagingSenderId: "5433701257",
      appId: "1:5433701257:web:35aae6ccb2d7d064a8dee8",
      measurementId: "G-ZX5DH3K2D"
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
