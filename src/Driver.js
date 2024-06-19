// src/Driver.js
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./Driver.css";
import locationLogo from "./assets/icon/location.png";
import { firestore } from "./firebase";

const Driver = () => {
  const { logout, userData } = useAuth();
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
    const updateLocation = async (position) => {
      const { latitude, longitude } = position.coords;
      const driverId = "driver-1"; // Unique identifier for the driver
      setLatitude(latitude);
      setLongitude(longitude);
      console.log(latitude, longitude);
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
  }, []);

  return (
    <div className="container">
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
