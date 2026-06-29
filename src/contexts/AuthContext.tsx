import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import type { UserProfile, UserRole } from '../types';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  role: UserRole | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  createUser: (email: string, password: string, profile: Partial<UserProfile>) => Promise<User>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const snap = await getDoc(doc(db, 'users', user.uid));
          if (snap.exists()) {
            setUserProfile(snap.data() as UserProfile);
          } else {
            // No Firestore profile yet — create a minimal default so the user
            // is never trapped on the login screen. Admins can upgrade the role later.
            const fallback: UserProfile = {
              uid: user.uid,
              email: user.email || '',
              displayName: user.displayName || (user.email ? user.email.split('@')[0] : 'User'),
              role: 'student',
              isActive: true,
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            await setDoc(doc(db, 'users', user.uid), {
              ...fallback,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            });
            setUserProfile(fallback);
          }
        } catch {
          // Even if Firestore is unreachable, give the UI a fallback profile so
          // the user reaches a dashboard instead of looping back to login.
          setUserProfile({
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || (user.email ? user.email.split('@')[0] : 'User'),
            role: 'student',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const createUser = async (email: string, password: string, profile: Partial<UserProfile>): Promise<User> => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (profile.displayName) {
      await updateProfile(cred.user, { displayName: profile.displayName });
    }
    const now = new Date();
    const userDoc: UserProfile = {
      uid: cred.user.uid,
      email,
      displayName: profile.displayName || '',
      role: profile.role || 'student',
      isActive: true,
      createdAt: now,
      updatedAt: now,
      createdBy: profile.createdBy,
      ...profile,
    };
    await setDoc(doc(db, 'users', cred.user.uid), {
      ...userDoc,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return cred.user;
  };

  const role = userProfile?.role ?? null;

  return (
    <AuthContext.Provider value={{ currentUser, userProfile, role, loading, login, logout, createUser }}>
      {children}
    </AuthContext.Provider>
  );
}
