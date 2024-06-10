// src/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { firestore } from "./firebase";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const savedAuthState = window.localStorage.getItem("isAuthenticated");
    return savedAuthState ? JSON.parse(savedAuthState) : false;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const docRef = doc(firestore, "shuttles", "driver-1");
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
    const docRef = doc(firestore, "shuttles", "driver-1");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.loggedIn) {
        throw new Error("Already logged in on another device");
      }

      if (data.username === username && data.password === password) {
        await updateDoc(docRef, {
          loggedIn: true,
        });
        setIsAuthenticated(true);
      } else {
        throw new Error("Invalid credentials!");
      }
    } else {
      throw new Error("No such user");
    }
  };

  const logout = async () => {
    const docRef = doc(firestore, "shuttles", "driver-1");
    await updateDoc(docRef, { loggedIn: false });
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
