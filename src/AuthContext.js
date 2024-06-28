// src/AuthContext.js
import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { createContext, useContext, useEffect, useState } from "react";
import { v4 } from "uuid";
import { firestore } from "./config/firebase";

const AuthContext = createContext();
const COLLECTION = "shuttles";

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const savedAuthState = window.localStorage.getItem("isAuthenticated");
    return savedAuthState ? JSON.parse(savedAuthState) : false;
  });
  const [loading, setLoading] = useState(true);
  // Initialize userData from localStorage
  const [userData, setUserData] = useState(() => {
    const savedUserData = window.localStorage.getItem("userData");
    return savedUserData ? JSON.parse(savedUserData) : null;
  });

  useEffect(() => {
    const checkAuth = async () => {
      if (!userData) {
        setLoading(false);
        return;
      }
      const docRefName =
        userData.username === "driver1" ? "driver-1" : "driver-2";

      const docRef = doc(firestore, COLLECTION, docRefName);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setIsAuthenticated(data.loggedIn);
        window.localStorage.setItem(
          "isAuthenticated",
          JSON.stringify(data.loggedIn)
        );
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (username, password) => {
    // get docrefname based on username with firestore query
    let docRefName = "";
    if (username === "driver1") {
      docRefName = "driver-1";
    } else {
      docRefName = "driver-2";
    }

    // if (username === 'driver1')
    const docRef = doc(firestore, COLLECTION, docRefName);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log("Data:", data);
      if (data.username === username && data.password === password) {
        // Step 1: Generate or retrieve a device ID
        let deviceId = localStorage.getItem("deviceId");
        if (!deviceId) {
          deviceId = v4(); // Implement this function based on your requirements
        }
        if (data.loggedIn) {
          // Step 3: Compare device IDs
          if (data.deviceId === deviceId) {
            console.log("Same device, already logged in");
            // Optionally, refresh the session or simply return
          } else {
            throw new Error("Already logged in on another device");
          }
        }
        // Step 2: Store the device ID on login
        await updateDoc(docRef, {
          loggedIn: true,
          deviceId: deviceId, // Store the device ID
        });
        setUserData(data);
        setIsAuthenticated(true);
        window.localStorage.setItem("userData", JSON.stringify(data));
        localStorage.setItem("deviceId", deviceId);
      } else {
        throw new Error("Invalid credentials!");
      }
    } else {
      throw new Error("No such user");
    }
  };

  const logout = async () => {
    const docRefName =
      userData.username === "driver1" ? "driver-1" : "driver-2";

    // Update the loggedIn status in your database
    const docRef = doc(firestore, COLLECTION, docRefName);
    await updateDoc(docRef, {
      loggedIn: false,
      // Optionally, you might want to clear or update the deviceId in the database as well
      deviceId: null, // Clear the deviceId in the database if necessary
    });

    // Remove the device ID from local storage
    localStorage.removeItem("deviceId");

    // Update local state to reflect that the user is no longer authenticated
    setIsAuthenticated(false);

    // Optionally, clear any other local storage or session data related to the user session
    window.localStorage.removeItem("isAuthenticated");

    // Clear userData from localStorage
    window.localStorage.removeItem("userData");
    // Clear user data from state
    setUserData(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, loading, userData }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
