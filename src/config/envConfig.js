module.exports = {
  env: process.env.NODE_ENV || "development",
  mapboxgl: {
    accessToken: process.env.REACT_APP_MAPBOXGL_ACCESS_TOKEN,
    mapStyles: process.env.REACT_APP_MAPBOXGL_MAP_STYLES,
  },
  firebase: {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
  },
};
