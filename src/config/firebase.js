// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import envConfig from "./envConfig";

const firebaseConfig = {
  apiKey: envConfig.firebase.apiKey,
  authDomain: envConfig.firebase.authDomain,
  projectId: envConfig.firebase.projectId,
  storageBucket: envConfig.firebase.storageBucket,
  messagingSenderId: envConfig.firebase.messagingSenderId,
  appId: envConfig.firebase.appId,
  measurementId: envConfig.firebase.measurementId,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Auth
const firestore = getFirestore(app);
const auth = getAuth(app);

// Export the necessary Firebase services
export { auth, firestore };
