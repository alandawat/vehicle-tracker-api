const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

let latestLocation = { imei: '', lat: '', lng: '' };

app.get('/api/update_location', (req, res) => {
  const { imei, lat, lng } = req.query;
  latestLocation = { imei, lat, lng };
  console.log(`Received: IMEI=${imei}, Latitude=${lat}, Longitude=${lng}`);
  res.send('Location saved successfully');
});

app.get('/latest_location', (req, res) => {
  if (!latestLocation.lat || !latestLocation.lng) {
    return res.send('<h2>No location data received yet.</h2>');
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Vehicle Tracker Viewer</title>
      <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
      <style>#map { height: 90vh; }</style>
    </head>
    <body>
      <h2>IMEI: ${latestLocation.imei} | Lat: ${latestLocation.lat} | Lng: ${latestLocation.lng}</h2>
      <div id="map"></div>
      <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
      <script>
        var map = L.map('map').setView([${latestLocation.lat}, ${latestLocation.lng}], 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);
        L.marker([${latestLocation.lat}, ${latestLocation.lng}]).addTo(map)
          .bindPopup('Current Vehicle Location')
          .openPopup();
      </script>
    </body>
    </html>
  `;
  res.send(html);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});