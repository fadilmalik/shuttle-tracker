// src/Map.js
import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { firestore } from "./firebase";
import { doc, onSnapshot } from "firebase/firestore";
import "./Map.css";
import sources from "./sources.json";
import logo from "./assets/shutup-logo.png";
import shuttle from "./assets/icon/bus.png";
import location from "./assets/icon/location.png";
import danger from "./assets/icon/danger.png";

mapboxgl.accessToken =
  "pk.eyJ1IjoiZmFkaWxtYWxpayIsImEiOiJjbHdwdnFobmMyb2NlMmlwcDB5dXhrc3ZxIn0.bP8EisT79t7XJh9UzuhHqg";

const Map = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  // const marker = useRef(null);
  const [lng, setLng] = useState(107.7695);
  const [lat, setLat] = useState(-6.9302);
  const [zoom, setZoom] = useState(15.9);

  useEffect(() => {
    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat], // Default center (Bandung coordinates)
      zoom: zoom, // Initial zoom level
    });

    map.marker = new mapboxgl.Marker();

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

          map.current.on("load", function () {
            // Check if the source already exists
            if (!map.current.getSource("route")) {
              // Check if the geometry data exists and is in the correct format
              console.log("route", sources.routes);
              if (
                sources.routes[0]?.geometry &&
                sources.routes[0].geometry.type === "LineString" &&
                Array.isArray(sources.routes[0].geometry.coordinates)
              ) {
                const waypoints = sources.waypoints.map(
                  (waypoint) => waypoint.location
                );
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

                // Add markers for each waypoint
                waypoints.forEach((waypoint, index) => {
                  map.current.addSource(`waypoint-${index}`, {
                    type: "geojson",
                    data: {
                      type: "Feature",
                      geometry: {
                        type: "Point",
                        coordinates: waypoint,
                      },
                      properties: {
                        title: `Waypoint ${index + 1}`,
                        icon: "marker",
                      },
                    },
                  });

                  map.current.addLayer({
                    id: `waypoint-${index}`,
                    type: "symbol",
                    source: `waypoint-${index}`,
                    layout: {
                      "icon-image": "{icon}-15",
                      "icon-allow-overlap": true,
                    },
                  });
                });
              } else {
                console.error("Invalid geometry data");
              }
            }
          });

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
      <div className="header">
        <img src={logo} alt="Shut Up!" className="header-image" />
        {/* <h1>Shut <img src={shuttle} alt="shuttle" style={{width: '24px'}} /> Up!</h1> */}
      </div>
      <div className="navtab">
        <a href="/map-info">
          <h2>Maps</h2>
        </a>
        <a href="/about-us">
          <h2>About Us</h2>
        </a>
      </div>
      <div ref={mapContainer} style={{ width: "100vw", height: "100vh" }} />
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
          <a href="/report"><img src={danger} alt="another icon" style={{ width: "30px" }} /></a>
        </h2>
      </div>
    </div>
  );
};

export default Map;
