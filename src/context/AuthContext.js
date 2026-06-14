import React, { createContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  updateProfile 
} from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sync auth state with Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          const userData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || (userDoc.exists() ? userDoc.data().name : 'User'),
          };
          setUser(userData);
          // Expose a dummy or real token string for compatibility with Route checks
          setToken(firebaseUser.accessToken || 'firebase-auth-active');
        } catch (error) {
          console.error("Error fetching user document from Firestore:", error);
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
    return userCredential.user;
  };

  const registerUser = async (name, email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    
    // Update Display Name in Firebase Auth
    await updateProfile(firebaseUser, { displayName: name });
    
    // Create User Document in Firestore
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    await setDoc(userDocRef, {
      uid: firebaseUser.uid,
      name: name,
      email: email,
      createdAt: new Date().toISOString()
    });

    // Sign out immediately so that the user is not automatically logged in
    await signOut(auth);

    return firebaseUser;
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
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};
