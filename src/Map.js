// src/Map.js
import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { firestore } from "./firebase";
import { doc, onSnapshot } from "firebase/firestore";
import "./Map.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoiZmFkaWxtYWxpayIsImEiOiJjbHdwdnFobmMyb2NlMmlwcDB5dXhrc3ZxIn0.bP8EisT79t7XJh9UzuhHqg";

const Map = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  // const marker = useRef(null);
  const [lng, setLng] = useState(107.5988);
  const [lat, setLat] = useState(-6.9183);
  const [zoom, setZoom] = useState(15);

  useEffect(() => {
    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat], // Default center (Bandung coordinates)
      zoom: zoom, // Initial zoom level
    });

    // Listen for driver's location updates from Firestore
    const unsubscribe = onSnapshot(
      doc(firestore, "shuttles", "driver-1"),
      (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          const { latitude, longitude } = data.coordinates;

          // Ensure coordinates are numbers
          const lat = Number(latitude);
          const lng = Number(longitude);

          map.current.on("load", function () {
            if (!map.current.getSource("marker")) {
              map.current.addSource("marker", {
                type: "geojson",
                data: {
                  type: "Feature",
                  geometry: {
                    type: "Point",
                    coordinates: [lng, lat],
                  },
                },
              });

              map.current.addLayer({
                id: "marker",
                type: "symbol",
                source: "marker",
                layout: {
                  "icon-image": "rocket-15", // This should be the name of your custom icon
                },
              });
            } else {
              map.current.getSource("marker").setData({
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: [lng, lat],
                },
              });
            }
          });

          map.current.flyTo({ center: [lng, lat], zoom: 15, speed: 0.5 });

          map.current.on('move', () => {
            setLng(map.current.getCenter().lng.toFixed(4));
            setLat(map.current.getCenter().lat.toFixed(4));
            setZoom(map.current.getZoom().toFixed(2));
          });
          
          setLng(lng.toFixed(4));
          setLat(lat.toFixed(4));
          setZoom(zoom.toFixed(2));
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
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div ref={mapContainer} style={{ width: "100%", height: "100vh" }} />
    </div>
  );
};

export default Map;
