// server.js
const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 3001, path: '/ws' });

server.on('connection', (ws) => {
  console.log('Client connected');

  // Send location updates to the client
  const sendLocationUpdates = () => {
    const location = {
      latitude: 42.35 + (Math.random() - 0.5) * 0.01, // Simulated latitude
      longitude: -70.9 + (Math.random() - 0.5) * 0.01 // Simulated longitude
    };
    ws.send(JSON.stringify(location));
  };

  const locationInterval = setInterval(sendLocationUpdates, 3000);

  ws.on('close', () => {
    console.log('Client disconnected');
    clearInterval(locationInterval);
  });
});

console.log('WebSocket server is running on ws://localhost:3001/ws');


// Listen for the process exit event
process.on('exit', () => {
  server.close(() => {
    console.log('WebSocket server is shutting down...');
  });
});