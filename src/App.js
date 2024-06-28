// src/App.js
import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import Map from "./Map";
import PrivateRoute from "./PrivateRoute";
import AboutUs from "./pages/about-us/AboutUs";
import Driver from "./pages/driver/Driver";
import Chat from "./pages/live-chat/Chat";
import ChatAdmin from "./pages/live-chat/ChatAdmin";
import Login from "./pages/login/Login";
import MapInfo from "./pages/map-info/MapInfo";
import Report from "./pages/report/Report";

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
          <Route path="/chat-admin" element={<ChatAdmin />} />
          <Route path="/" element={<Map />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
