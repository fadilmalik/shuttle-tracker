// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB_kL9ikISYnEUmfRnYvQiR-qk2WSG6OJM",
  authDomain: "shuttle-tracker-75d56.firebaseapp.com",
  projectId: "shuttle-tracker-75d56",
  storageBucket: "shuttle-tracker-75d56.appspot.com",
  messagingSenderId: "898564695228",
  appId: "1:898564695228:web:95395c512e7bacd7a8dcb9",
  measurementId: "G-XNVKME6J08",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Auth
const firestore = getFirestore(app);
const auth = getAuth(app);

// Export the necessary Firebase services
export { auth, firestore };
