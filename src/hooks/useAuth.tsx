"use client";

import { useEffect, useState } from "react";
import { getFirebase } from "../lib/firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User
} from "firebase/auth";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getFirebase().auth!, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(getFirebase().auth!, provider);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(getFirebase().auth!);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return { user, login, logout };
}
