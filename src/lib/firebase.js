
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "chat-application-8d5f7.firebaseapp.com",
  projectId: "chat-application-8d5f7",
  storageBucket: "chat-application-8d5f7.appspot.com",
  messagingSenderId: "398148283806",
  appId: "1:398148283806:web:28c0e8f0e40eec8fd3ba8f"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();

export const db = getFirestore(app);

export const storage = getStorage(app);

