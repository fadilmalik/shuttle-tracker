import React from "react";
import backgroundImage from "./assets/background.png";
import { useNavigate } from "react-router-dom";
import backButton from "./assets/icon/back-button.png";
import "./Report.css";
import warning from "./assets/icon/warning.png";

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="aboutus-header" style={{ position: "relative" }}>
        <button
          onClick={() => navigate(-1)}
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
        <h2>Report</h2>
      </div>
      <div
        className="about-us"
        style={{
          padding: "50px",
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          width: "100vw",
          height: "100vh",
          boxSizing: "border-box",
        }}
      >
        <div className="content-report">
          <img src={warning} alt="warning" style={{ width: '50px' }} />
          <p>
            Jika ada saran atau keluhan, anda bisa melapor dengan menekan
            tombol di bawah ini
          </p>
          <button>Berikan Saran</button>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
