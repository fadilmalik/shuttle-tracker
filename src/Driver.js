// src/Driver.js
import React, { useEffect } from 'react';
import { firestore } from './firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const Driver = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();


  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out', error);
    }
  };

  useEffect(() => {
    const updateLocation = async (position) => {
      const { latitude, longitude } = position.coords;
      const driverId = 'driver-1'; // Unique identifier for the driver
      // await setDoc(doc(firestore, 'shuttles', driverId), {
      //   coordinates: {
      //     latitude,
      //     longitude,
      //   },
      //   timestamp: serverTimestamp(),
      // });

      await updateDoc(doc(firestore, 'shuttles', driverId), {
        'coordinates.latitude': latitude,
        'coordinates.longitude': longitude,
        timestamp: serverTimestamp(),
    });
    };

    const handlePositionUpdate = (position) => {
      updateLocation(position);
    };

    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(handlePositionUpdate, (error) => {
        console.error(error);
      }, {
        enableHighAccuracy: true,
      });
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  return (
  <div>
    Driver Dashboard
    <button onClick={handleLogout}>Logout</button>
  </div>);
};

export default Driver;
