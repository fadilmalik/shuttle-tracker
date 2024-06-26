import React from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../../assets/background.png";
import backButton from "../../assets/icon/back-button.png";
import staticMap from "../../assets/static-map.jpeg";
import "../report/Report.css";
import "./MapInfo.css";

const MapInfo = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        fontFamily: "Coiny, sans-serif",
      }}
    >
      <div className="aboutus-header" style={{ position: "relative" }}>
        <button
          onClick={() => navigate("/")}
          style={{
            position: "absolute",
            top: "50%",
            left: "10px",
            transform: "translateY(-50%)",
            backgroundColor: "transparent",
            border: "none",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          <img
            src={backButton}
            alt="back"
            style={{
              width: "30px",
            }}
          />
        </button>
        <h2>Maps</h2>
      </div>
      <div
        className="about-us"
        style={{
          padding: "10px",
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          width: "100vw",
          height: "100vh",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            // padding: "50px",
          }}
        >
          <img
            className="static-map"
            src={staticMap}
            alt="staticMap"
            style={{ width: "500px", height: "90vh", borderRadius: "20px" }}
          />
        </div>
      </div>
    </div>
  );
};

export default MapInfo;
