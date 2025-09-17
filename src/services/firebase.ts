import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAZ6GmaCOjAQyOxto_suZcj6jkB37uFBPs",
  authDomain: "dq-2-7468e.firebaseapp.com",
  projectId: "dq-2-7468e",
  storageBucket: "dq-2-7468e.firebasestorage.app",
  messagingSenderId: "938137580113",
  appId: "1:938137580113:web:3f6afc853b4ff7e4f73e70",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

