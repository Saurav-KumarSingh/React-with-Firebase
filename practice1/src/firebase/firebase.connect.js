import { initializeApp } from "firebase/app";


const firebaseConfig = {
  apiKey: "AIzaSyDnslBhNJ2N7ZPDFjX49vYAwJomlYOazYo",
  authDomain: "react-firebase-e5fa4.firebaseapp.com",
  projectId: "react-firebase-e5fa4",
  storageBucket: "react-firebase-e5fa4.appspot.com",
  messagingSenderId: "135075403601",
  appId: "1:135075403601:web:8bc96ff4231d21633ca570",
  databaseURL:"https://react-firebase-e5fa4-default-rtdb.firebaseio.com"
};


const app = initializeApp(firebaseConfig);

export default app