// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Driver from "./Driver";
import Map from "./Map";
import Login from "./Login";
import AboutUs from "./AboutUs";
import Report from "./Report";
import PrivateRoute from "./PrivateRoute";
import { AuthProvider } from "./AuthContext";

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
          <Route path="/" element={<Map />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
