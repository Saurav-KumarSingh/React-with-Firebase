import { createContext, useContext } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { getDatabase, set, ref } from "firebase/database";
import { initializeApp } from "firebase/app";

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  databaseURL: import.meta.env.VITE_DATABASE_URL,
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getDatabase(firebaseApp);
const googleAuth = new GoogleAuthProvider();
const FirebaseContext = createContext(null);

// Firebase Provider component
export const FirebaseProvider = ({ children }) => {
  // Sign up with email and password
  const signupWithEmailandPassword = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User signed up:', userCredential.user);
      return userCredential;
    } catch (error) {
      console.error("Error signing up with email and password:", error.code, error.message);
      throw error;
    }
  };

  // Login with email and password
  const Login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('User logged in:', userCredential.user);
      return userCredential;
    } catch (error) {
      console.error("Error logging in with email and password:", error.code, error.message);
      throw error;
    }
  };

  // Sign up/in with Google
  const signupWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleAuth);
      console.log('User signed up with Google:', result.user);
      return result;
    } catch (error) {
      console.error("Error signing up with Google:", error.code, error.message);
      throw error;
    }
  };

  // Send data to Firebase Realtime Database
  const sendData = async (key, data) => {
    try {
      await set(ref(db, key), data);
      console.log('Data sent to database:', { key, data });
    } catch (error) {
      console.error("Error sending data to the database:", error.code, error.message);
      throw error;
    }
  };

  return (
    <FirebaseContext.Provider
      value={{ signupWithEmailandPassword, sendData, Login, signupWithGoogle }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

// Custom hook to use Firebase context
export const useFireBase = () => useContext(FirebaseContext);

export default FirebaseProvider;
