import { createContext, useContext } from "react";
import { getAuth, createUserWithEmailAndPassword,signInWithEmailAndPassword} from "firebase/auth";
import { getDatabase, set, ref } from 'firebase/database';
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  databaseURL: import.meta.env.VITE_DATABASE_URL,
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getDatabase(firebaseApp);

const FirebaseContext = createContext(null);

export const FirebaseProvider = (props) => {

  const signupWithEmailandPassword = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };
  const Login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };


  const sendData = (key, data) => {
    return set(ref(db, key), data);
  };

  return (
    <FirebaseContext.Provider value={{ signupWithEmailandPassword, sendData,Login }}>
      {props.children}
    </FirebaseContext.Provider>
  );
};

// custom hook
export const useFireBase = () => useContext(FirebaseContext);

export default FirebaseProvider;
