import React from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../../assets/background.png";
import backButton from "../../assets/icon/back-button.png";
import shutupTeam from "../../assets/shutup-team.jpeg";
import "./AboutUs.css";

const AboutUs = () => {
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
        <h2>About Us</h2>
      </div>
      <div
        className="about-us"
        style={{
          padding: "50px",
          backgroundImage: `url(${backgroundImage})`,
          backgroundRepeat: "repeat",
          backgroundPosition: "center",
          width: "100vw",
          // height: "100vh",
          boxSizing: "border-box",
        }}
      >
        <div
          className="content"
          style={{
            marginTop: "0px",
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
          className=""
          style={{
            marginTop: "30px",
            color: "#fff",
            // padding: "30px",
            // paddingTop: "10px",
            paddingBottom: "10px",
            textAlign: "center",
            borderRadius: "20px",
            backgroundColor: "#0D1437",
          }}
        >
          <div className="content-card">
            <h3>Shut Up Team</h3>
            <img
              className="shutup-team"
              src={shutupTeam}
              alt="Shut Up Team"
              style={{
                // width: "80%",
                objectFit: "cover",
                objectPosition: "50% 50%",
                borderRadius: "20px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
