import React from "react";
import backgroundImage from "./assets/background.png";
import "./AboutUs.css";
import { useNavigate } from "react-router-dom";
import backButton from "./assets/icon/back-button.png";

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
        <h2>About Us</h2>
      </div>
      <div
        className="about-us"
        style={{
          padding: "50px",
          backgroundImage: `url(${backgroundImage})`,
          backgroundRepeat: 'repeat-y',
          backgroundPosition: "center",
          width: "100vw",
          height: "100vh",
          boxSizing: "border-box"}}
      >
        <div
          className="content"
          style={{
            backgroundColor: "#0D1437",
            color: "#fff",
            padding: "30px",
            paddingTop: "10px",
            paddingBottom: "10px",
            textAlign: "center",
            borderRadius: "20px",
          }}
        >
          <h3>About Shut Up!</h3>
          <p>
            Shut Up adalah sebuah situs web yang berfungsi sebagai platform
            untuk membantu mahasiswa ITB Jatinangor dalam memantau dan melacak
            shuttle yang beroperasi di sekitar kampus. Dengan adanya Shut Up,
            mahasiswa dapat dengan mudah mengetahui lokasi shuttle yang
            tersedia, sehingga memudahkan mereka dalam merencanakan perjalanan
            di dalam area kampus.
          </p>
          <p>
            Shut Up dibuat oleh sekelompok mahasiswa Fakultas Ilmu dan Teknologi
            Kebumian (FITB) dari angkatan 23, dengan dibuatnya web ini kami
            harap web ini bisa berfungsi dan berguna bagi seluruh mahasiswa di
            ITB Jatinangor.
          </p>
        </div>
        <div
          className="content"
          style={{
            marginTop: "50px",
            backgroundColor: "#0D1437",
            color: "#fff",
            padding: "30px",
            paddingTop: "10px",
            paddingBottom: "10px",
            textAlign: "center",
            borderRadius: "20px",
          }}
        >
          <h3>Our Team</h3>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
