// src/Driver.js
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./Driver.css";
import locationLogo from "./assets/icon/location.png";
import { firestore } from "./firebase";

const Driver = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  useEffect(() => {
    const checkDeviceId = async () => {
      try {
        // Step 1: Retrieve the deviceId from local storage
        const localDeviceId = localStorage.getItem("deviceId");

        // Step 2: Fetch the current deviceId stored in the database for the user
        const docRef = doc(firestore, "shuttles", "driver-1"); // Assuming 'driver-1' is the user's ID
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const databaseDeviceId = docSnap.data().deviceId;

          // Step 3: Compare the two deviceIds
          if (localDeviceId !== databaseDeviceId) {
            // If they are not the same, display an alert and navigate to the login page
            // alert("Your session has been terminated on this device.");
            navigate("/login");
            return true;
          }
        } else {
          console.log("No such document!");
          return false;
        }
      } catch (error) {
        console.error("Error fetching device ID", error);
        return false;
      }
    };

    const isValidSession = checkDeviceId();
    if (isValidSession) {
      const updateLocation = async (position) => {
        const { latitude, longitude } = position.coords;
        const driverId = "driver-1"; // Unique identifier for the driver
        setLatitude(latitude);
        setLongitude(longitude);

        await updateDoc(doc(firestore, "shuttles", driverId), {
          "coordinates.latitude": latitude,
          "coordinates.longitude": longitude,
          timestamp: serverTimestamp(),
        });
      };

      const handlePositionUpdate = (position) => {
        updateLocation(position);
      };

      if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
          handlePositionUpdate,
          (error) => {
            console.error(error);
          },
          {
            enableHighAccuracy: true,
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    }
  }, [navigate]);

  return (
    <div
      className="container"
      style={{
        fontFamily: "Coiny, sans-serif",
      }}
    >
      <div className="card">
        <img src={locationLogo} alt="Location Icon" className="location-logo" />
        <h2 className="card-title">Your Live Location</h2>

        <p className="coordinates">Longitude: {longitude}</p>
        <p className="coordinates">Latitude: {latitude}</p>

        <button className="btn-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Driver;
