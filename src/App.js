// src/App.js
import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AboutUs from "./AboutUs";
import { AuthProvider } from "./AuthContext";
import Chat from "./Chat";
import Driver from "./Driver";
import Login from "./Login";
import Map from "./Map";
import MapInfo from "./MapInfo";
import PrivateRoute from "./PrivateRoute";
import Report from "./Report";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/driver" element={<PrivateRoute />}>
            <Route path="/driver" element={<Driver />} />
          </Route>
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/report" element={<Report />} />
          <Route path="/map-info" element={<MapInfo />} />
          <Route path="/chat-customer" element={<Chat />} />
          <Route path="/" element={<Map />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
