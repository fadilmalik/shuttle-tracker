// src/Map.js
import { doc, onSnapshot } from "firebase/firestore";
import mapboxgl from "mapbox-gl";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Map.css";
import bubbleChat from "./assets/icon/bubble-chat.png";
import shuttle from "./assets/icon/bus.png";
import danger from "./assets/icon/danger.png";
import location from "./assets/icon/location.png";
import shuttleStation from "./assets/icon/shuttle-station.png";
import logo from "./assets/shutup-logo.png";
import { firestore } from "./firebase";
import sources from "./sources.json";

mapboxgl.accessToken =
  "pk.eyJ1IjoiZmFkaWxtYWxpayIsImEiOiJjbHdwdnFobmMyb2NlMmlwcDB5dXhrc3ZxIn0.bP8EisT79t7XJh9UzuhHqg";

const Map = () => {
  let chatId = sessionStorage.getItem("chatId");
  console.log("chatId", chatId);
  const navigate = useNavigate(); // Initialize useHistory
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(107.7691);
  const [lat, setLat] = useState(-6.9289);
  const [zoom, setZoom] = useState(15.7);

  const navigateToChat = () => {
    if (chatId) {
      navigate("/chat-customer", { state: { chatId: chatId } });
    } else {
      navigate("/report");
    }
  };

  useEffect(() => {
    const newChatId = "chat-" + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem("chatId", newChatId);

    const deviceId = localStorage.getItem("deviceId");
    if (deviceId) {
      navigate("/driver"); // Redirect to /driver if device ID is found
    }

    // Initialize map
    map.current = new mapboxgl.Map({
      container: "root",
      style: "mapbox://styles/fadilmalik/clxny335800iv01qq5w8bd7pq",
      center: [lng, lat], // Default center (Bandung coordinates)
      zoom: zoom, // Initial zoom level
    });

    map.marker = new mapboxgl.Marker({
      scale: 0.8,
    });

    map.current.on("load", function () {
      // Check if the source already exists
      if (!map.current.getSource("route")) {
        // Check if the geometry data exists and is in the correct format
        if (
          sources.routes[0]?.geometry &&
          sources.routes[0].geometry.type === "LineString" &&
          Array.isArray(sources.routes[0].geometry.coordinates)
        ) {
          const routes = sources.routes[0].geometry.coordinates;

          const routeData = {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: [...routes],
            },
          };

          map.current.addSource("route", {
            type: "geojson",
            data: routeData,
          });

          map.current.addLayer({
            id: "route",
            type: "line",
            source: "route",
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": "#5271FF",
              "line-width": 3,
            },
          });
        } else {
          console.error("Invalid geometry data");
        }
      }

      // Obtain the user's current location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;

          // Add a marker for the user's location
          map.marker.setLngLat([userLng, userLat]).addTo(map.current);

          // Optionally, center the map on the user's location
          // map.current.flyTo({ center: [userLng, userLat], zoom: 15 });
        });
      } else {
        console.log("Geolocation is not supported by this browser.");
      }

      // Function to fly to the user's current location
      function flyToUserLocation() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const userLat = position.coords.latitude;
              const userLng = position.coords.longitude;
              console.log("User's location:", userLat, userLng);
              // Center the map on the user's location
              map.current.flyTo({ center: [userLng, userLat], zoom: 15 });
            },
            (error) => {
              console.error("Error obtaining location", error);
            }
          );
        } else {
          console.log("Geolocation is not supported by this browser.");
        }
      }

      // Attach the flyToUserLocation function to a click event on an element
      document
        .getElementById("your-location")
        .addEventListener("click", flyToUserLocation);
    });

    map.current.on("click", (event) => {
      const features = map.current.queryRenderedFeatures(event.point, {
        layers: ["shutup-street"], // replace with your layer name
      });
      if (!features.length) {
        return;
      }
      const feature = features[0];

      // Detect if the browser is Safari
      const isSafari = /^((?!chrome|android).)*safari/i.test(
        navigator.userAgent
      );

      new mapboxgl.Popup({ offset: [0, -15] })
        .setLngLat(feature.geometry.coordinates)
        .setHTML(
          `
          <img className="popup-image" src="${
            process.env.PUBLIC_URL
          }/shuttle-stop/${feature.properties.image}" 
            alt="image" 
            style="
              width: ${isSafari ? "fit-content" : "-webkit-fit-content"};
              width: ${isSafari ? "200px" : ""};
              height: 100px;
              border-radius: 5px;
              object-fit: cover;
              display: block;
              margin-left: auto;
              margin-right: auto;
            ">
          <h3 style="margin: 0; font: 12px/20px Helvetica Neue,Arial,Helvetica,sans-serif;font-weight: bold;">${
            feature.properties.title
          }</h3>
          `
        )
        .addTo(map.current);
    });

    // Listen for driver's location updates from Firestore
    const unsubscribe1 = onSnapshot(
      // driver-1
      doc(firestore, "shuttles", "driver-1"),
      (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          console.log("lng", lng, "lat", lat, "zoom", zoom);
          const loggedIn = data.loggedIn;
          const { longitude: driverLng, latitude: driverLat } =
            data.coordinates;
          console.log("Driver's location:", driverLat, driverLng);

          let geojson = {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: [driverLng, driverLat],
                },
              },
            ],
          };
          console.log("geojson", geojson);
          if (loggedIn === true) {
            // Ensure coordinates are numbers
            // Check if the source already exists before adding it
            if (!map.current.getSource("iss")) {
              map.current.addSource("iss", { type: "geojson", data: geojson });

              map.current.addLayer({
                id: "iss",
                type: "symbol",
                source: "iss",
                layout: {
                  "icon-image": "marker-shuttle",
                },
              });

              // map.current.getSource("iss").setData(geojson);
            } else {
              // If it exists, update its data
              map.current.getSource("iss").setData(geojson);
            }

            // map.current.moveLayer("iss");
          } else {
            // if (map.current.getLayer("iss")) {
            //   map.current.removeLayer("iss");
            //   if (map.current.getSource("iss")) {
            //     map.current.removeSource("iss");
            //   }
            // }
          }

          map.current.on("move", () => {
            setLng(map.current.getCenter().lng.toFixed(4));
            setLat(map.current.getCenter().lat.toFixed(4));
            setZoom(map.current.getZoom().toFixed(2));
          });

          // setLng(lng.toFixed(4));
          // setLat(lat.toFixed(4));
          // setZoom(zoom.toFixed(2));
        }
      }
    );

    const unsubscribe2 = onSnapshot(
      doc(firestore, "shuttles", "driver-2"),
      (doc) => {
        if (doc.exists()) {
          const data = doc.data();

          const loggedIn = data.loggedIn;
          const { longitude: driverLng, latitude: driverLat } =
            data.coordinates;

          let geojson = {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: [driverLng, driverLat],
                },
              },
            ],
          };

          if (loggedIn === true) {
            // Ensure coordinates are numbers
            // Check if the source already exists before adding it
            if (!map.current.getSource("iss")) {
              map.current.addSource("iss", { type: "geojson", data: geojson });

              map.current.addLayer({
                id: "iss",
                type: "symbol",
                source: "iss",
                layout: {
                  "icon-image": "marker-shuttle",
                },
              });

              // map.current.getSource("iss").setData(geojson);
            } else {
              // If it exists, update its data
              map.current.getSource("iss").setData(geojson);
            }

            // map.current.moveLayer("iss");
          } else {
            if (map.current.getLayer("iss")) {
              map.current.removeLayer("iss");
              if (map.current.getSource("iss")) {
                map.current.removeSource("iss");
              }
            }
          }
        }
      }
    );

    // Clean up on unmount
    return () => {
      map.current.remove();
      map.marker.remove();
      unsubscribe1();
      unsubscribe2();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="the-header">
        <div className="header">
          {/* add button login */}
          <button
            className="login-button"
            onClick={() => {
              navigate("/login");
            }}
          >
            Login
          </button>
          <img src={logo} alt="Shut Up!" className="header-image" />
        </div>
        <div className="navtab">
          <a href="/map-info">
            <h2>Maps</h2>
          </a>
          <a href="/about-us">
            <h2>About Us</h2>
          </a>
        </div>
      </div>
      <div className="map-container" ref={mapContainer} />
      <div className="floating-icon-left">
        <h2 style={{ fontSize: "13px" }}>
          <img
            src={shuttleStation}
            alt="shuttleStation"
            style={{ width: "25px", marginRight: "5px" }}
          />{" "}
          Shuttle Station
        </h2>
        <h2 style={{ fontSize: "13px" }}>
          <img
            src={shuttle}
            alt="shuttle"
            style={{ width: "25px", marginRight: "5px" }}
          />{" "}
          Shuttle
        </h2>
        <h2 style={{ fontSize: "13px", cursor: "pointer" }} id="your-location">
          <img
            src={location}
            alt="location"
            style={{ width: "25px", marginRight: "5px" }}
            title="Click to go to your location"
          />{" "}
          Your Location
        </h2>
      </div>
      <div className="floating-icon-right">
        <h2 style={{ fontSize: "15px", display: "flex", alignItems: "center" }}>
          <a href="/report">
            <img src={danger} alt="another icon" style={{ width: "30px" }} />
          </a>
        </h2>
        <h2 style={{ fontSize: "15px", display: "flex", alignItems: "center" }}>
          <a href="/chat-customer" onClick={navigateToChat}>
            <img
              src={bubbleChat}
              alt="another icon"
              style={{ width: "30px" }}
            />
          </a>
        </h2>
      </div>
    </div>
  );
};

export default Map;
