import React, { createContext, useState, useEffect, useRef } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  updateProfile,
  sendEmailVerification
} from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const isRegisteringRef = useRef(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        if (!firebaseUser.emailVerified) {
          if (!isRegisteringRef.current) {
            // Force sign out if somehow authenticated but not email-verified
            await signOut(auth);
            setUser(null);
            setToken(null);
            setLoading(false);
            return;
          }
          setLoading(false);
          return;
        }

        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          let userDoc = await getDoc(userDocRef);
          
          if (!userDoc.exists()) {
            const userData = {
              uid: firebaseUser.uid,
              name: firebaseUser.displayName || 'User',
              email: firebaseUser.email,
              createdAt: new Date().toISOString()
            };
            await setDoc(userDocRef, userData);
            userDoc = await getDoc(userDocRef); // Refetch user document
          }
          
          const userData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || (userDoc.exists() ? userDoc.data().name : 'User'),
          };
          setUser(userData);
          // Expose a dummy or real token string for compatibility with Route checks
          setToken(firebaseUser.accessToken || 'firebase-auth-active');
        } catch (error) {
          console.error("Error fetching or creating user document in Firestore:", error);
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || 'User',
          });
          setToken('firebase-auth-active');
        }
      } else {
        setUser(null);
        setToken(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginUser = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    
    if (!firebaseUser.emailVerified) {
      await signOut(auth);
      const error = new Error('Please verify your email before logging in. We have sent a verification link to your email.');
      error.code = 'auth/email-not-verified';
      throw error;
    }
    
    // Check and create Firestore document here to ensure token synchronization has completed
    try {
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) {
        const userData = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || 'User',
          email: firebaseUser.email,
          createdAt: new Date().toISOString()
        };
        await setDoc(userDocRef, userData);
      }
    } catch (err) {
      console.error("Error creating user document in loginUser:", err);
    }
    
    return firebaseUser;
  };

  const registerUser = async (name, email, password) => {
    isRegisteringRef.current = true;
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Update Display Name in Firebase Auth (so it persists inside Auth metadata)
      await updateProfile(firebaseUser, { displayName: name });

      // Send email verification
      await sendEmailVerification(firebaseUser);
      
      // Sign out immediately so that the user is not automatically logged in
      await signOut(auth);

      return firebaseUser;
    } finally {
      isRegisteringRef.current = false;
    }
  };

  const resendVerificationEmail = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    await sendEmailVerification(firebaseUser);
    await signOut(auth);
  };

  const logoutUser = async () => {
    await signOut(auth);
  };

  // Compatibility shims for any legacy components that call context.login() or context.logout()
  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
  };

  const logout = async () => {
    await logoutUser();
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      loading, 
      loginUser, 
      registerUser, 
      logoutUser,
      resendVerificationEmail,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};
