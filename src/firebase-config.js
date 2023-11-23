// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { OAuthProvider, getAuth, signInAnonymously } from "firebase/auth";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA3eCI8CzYlcFTWAhRZeZA8WdVREMikAiw",
  authDomain: "cellonthebeach.firebaseapp.com",
  projectId: "cellonthebeach",
  storageBucket: "cellonthebeach.appspot.com",
  messagingSenderId: "245874149059",
  appId: "1:245874149059:web:a635269d94bfc0b5e48476"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new OAuthProvider(auth);
export const db = getFirestore(app);

// export const provider = new signInAnonymously();