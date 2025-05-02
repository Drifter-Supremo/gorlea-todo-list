import { useEffect, useState, useCallback } from "react";
import { getFirebase } from "../src/lib/firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getFirebase().auth!, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(getFirebase().auth!, provider);
  }, []);

  const logout = useCallback(async () => {
    await signOut(getFirebase().auth!);
  }, []);

  return { user, loading, login, logout };
}
