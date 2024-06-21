// src/Map.js
import { doc, onSnapshot } from "firebase/firestore";
import mapboxgl from "mapbox-gl";
import React, { useEffect, useRef, useState } from "react";
import "./Map.css";
import shuttle from "./assets/icon/bus.png";
import danger from "./assets/icon/danger.png";
import location from "./assets/icon/location.png";
import logo from "./assets/shutup-logo.png";
import { firestore } from "./firebase";
import sources from "./sources.json";

mapboxgl.accessToken =
  "pk.eyJ1IjoiZmFkaWxtYWxpayIsImEiOiJjbHdwdnFobmMyb2NlMmlwcDB5dXhrc3ZxIn0.bP8EisT79t7XJh9UzuhHqg";

const Map = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(107.7691);
  const [lat, setLat] = useState(-6.9289);
  const [zoom, setZoom] = useState(15.7);

  useEffect(() => {
    // Initialize map
    map.current = new mapboxgl.Map({
      container: "root",
      style: "mapbox://styles/fadilmalik/clxny335800iv01qq5w8bd7pq",
      center: [lng, lat], // Default center (Bandung coordinates)
      zoom: zoom, // Initial zoom level
    });

    map.marker = new mapboxgl.Marker();

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
    const unsubscribe = onSnapshot(
      doc(firestore, "shuttles", "driver-1"),
      (doc) => {
        if (doc.exists()) {
          // const data = doc.data();
          // const { latitude, longitude } = data.coordinates;

          // Ensure coordinates are numbers
          // const lat = Number(latitude);
          // const lng = Number(longitude);

          // map.current.flyTo({ center: [lng, lat], zoom: 15});

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

    // Clean up on unmount
    return () => {
      map.current.remove();
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="the-header">
        <div className="header">
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
            src={shuttle}
            alt="shuttle"
            style={{ width: "25px", marginRight: "5px" }}
          />{" "}
          Shuttle
        </h2>
        <h2 style={{ fontSize: "13px" }}>
          <img
            src={location}
            alt="shuttle"
            style={{ width: "25px", marginRight: "5px" }}
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
      </div>
    </div>
  );
};

export default Map;
