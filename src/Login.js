// src/Login.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./Login.css";
import logo from "./assets/shutup-logo.png";

const Login = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve the userData from local storage
    const userData = localStorage.getItem("userData");

    // Check if userData is not null
    if (userData) {
      navigate("/driver");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (username === "admin" && password === "adminshutup") {
        return navigate("/chat-admin", { state: { authenticated: true } });
      } else {
        await login(username, password);
      }

      navigate("/driver");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      className="form-container"
      style={{
        fontFamily: "Coiny, sans-serif",
      }}
    >
      <form onSubmit={handleLogin} className="login-form">
        <img src={logo} alt="ShutUp Logo" className="logo" />

        <div className="input-group">
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
