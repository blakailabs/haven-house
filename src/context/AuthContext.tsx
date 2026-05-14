"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db, isFirebaseConfigured } from '@/lib/firebase/clientApp';

export interface User {
  uid: string;
  name: string;
  email: string;
  role: 'admin' | 'staff' | 'resident';
  onboarding_completed: boolean;
  residentId?: string; // Linked resident document if role is resident
}

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password?: string) => Promise<User>;
  loginWithGoogle: () => Promise<User>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  login: async () => ({ uid: '', name: '', email: '', role: 'resident', onboarding_completed: false }),
  loginWithGoogle: async () => ({ uid: '', name: '', email: '', role: 'resident', onboarding_completed: false }),
  logout: () => {},
  refreshUser: async () => {},
  isAuthenticated: false,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const isProd = process.env.NODE_ENV === 'production';
  const useMockMode = !isProd && !isFirebaseConfigured;

  useEffect(() => {
    if (useMockMode) {
      if (typeof window !== 'undefined') {
        const stored = window.localStorage.getItem('haven_house_session');
        if (stored) {
          try { setCurrentUser(JSON.parse(stored)); } catch (e) { /* silent */ }
        }
      }
      setLoading(false);
      return;
    }

    let unsubscribeDoc: (() => void) | undefined;

    const setupFirebase = async () => {
      if (!auth || !db) {
        setLoading(false);
        return undefined;
      }

      const { onAuthStateChanged } = await import('firebase/auth');
      const { doc, getDoc, onSnapshot } = await import('firebase/firestore');

      const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
        try {
          if (user && user.email) {
            const userDocRef = doc(db!, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);
            
            if (userDoc.exists()) {
              const data = userDoc.data() as User;
              setCurrentUser(data);
            } else {
              console.log("No user document found for UID:", user.uid);
              // If user is authenticated but no doc exists, we might need to create one or handle it
              // For now, we'll just set a basic profile
              setCurrentUser({
                uid: user.uid,
                name: user.displayName || 'User',
                email: user.email,
                role: 'resident',
                onboarding_completed: false
              });
            }

            unsubscribeDoc = onSnapshot(doc(db!, 'users', user.uid), (snap) => {
              if (snap.exists()) {
                setCurrentUser(snap.data() as User);
              }
            });
          } else {
            setCurrentUser(null);
            if (unsubscribeDoc) unsubscribeDoc();
          }
        } catch (err) {
          console.error("Auth observer error:", err);
          setCurrentUser(null);
        } finally {
          setLoading(false);
        }
      });

      return unsubscribeAuth;
    };

    let unsubscribeAuth: (() => void) | undefined;
    setupFirebase().then(unsub => { unsubscribeAuth = unsub; });

    return () => {
      unsubscribeAuth?.();
      unsubscribeDoc?.();
    };
  }, [useMockMode]);

  const login = async (email: string, password?: string) => {
    if (useMockMode) {
      const mockUser: User = { 
        uid: 'mock-admin', 
        name: 'Admin User', 
        email: email, 
        role: 'admin', 
        onboarding_completed: true 
      };
      if (typeof window !== 'undefined') window.localStorage.setItem('haven_house_session', JSON.stringify(mockUser));
      setCurrentUser(mockUser);
      return mockUser;
    }

    const { signInWithEmailAndPassword } = await import('firebase/auth');
    if (!auth) throw new Error("Firebase Auth not initialized");
    const result = await signInWithEmailAndPassword(auth, email, password!);
    
    // User doc will be handled by the observer
    return currentUser!;
  };

  const loginWithGoogle = async () => {
    if (useMockMode) return login('admin@example.com');

    const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth');
    if (!auth) throw new Error("Firebase Auth not initialized");
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return currentUser!;
  };

  const logout = async () => {
    if (useMockMode) {
      if (typeof window !== 'undefined') window.localStorage.removeItem('haven_house_session');
      setCurrentUser(null);
      return;
    }

    const { signOut } = await import('firebase/auth');
    if (auth) await signOut(auth);
    setCurrentUser(null);
  };

  const refreshUser = async () => {
    if (!auth?.currentUser || !db) return;
    const { doc, getDoc } = await import('firebase/firestore');
    const snap = await getDoc(doc(db, 'users', auth.currentUser.uid));
    if (snap.exists()) setCurrentUser(snap.data() as User);
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      login,
      loginWithGoogle,
      logout,
      refreshUser,
      isAuthenticated: !!currentUser,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};
