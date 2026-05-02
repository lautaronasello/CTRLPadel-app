import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBAhNEagtc-e6FvnM2JFRkKb8ErDsvTf_I",
  authDomain: "ctrlpadel-app-2026.firebaseapp.com",
  projectId: "ctrlpadel-app-2026",
  storageBucket: "ctrlpadel-app-2026.firebasestorage.app",
  messagingSenderId: "749601015068",
  appId: "1:749601015068:web:07654cad30a6d3f0be66d9"
};

// Initialize Firebase (singleton pattern for Next.js)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
