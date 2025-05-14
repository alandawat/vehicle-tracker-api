const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

let latestLocation = { imei: '', lat: '', lng: '' };

app.get('/api/update_location', (req, res) => {
  const { imei, lat, lng } = req.query;
  latestLocation = { imei, lat, lng };
  console.log(`Received: IMEI=${imei}, Latitude=${lat}, Longitude=${lng}`);
  res.json({ success: true });
});

app.get('/latest_location', (req, res) => {
  if (!latestLocation.lat || !latestLocation.lng) {
    return res.send('<h2>No location data received yet.</h2>');
  }
  res.json(latestLocation);
});

app.get('/live_tracker', (req, res) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Live Vehicle Tracker</title>
      <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
      <style>#map { height: 90vh; }</style>
    </head>
    <body>
      <h2>Live Vehicle Tracker</h2>
      <div id="map"></div>
      <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
      <script>
        var map = L.map('map').setView([0, 0], 2);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        var marker = null;

        async function fetchLocation() {
          const response = await fetch('/latest_location');
          if (response.ok) {
            const data = await response.json();
            if (data.lat && data.lng) {
              const lat = parseFloat(data.lat);
              const lng = parseFloat(data.lng);
              if (marker) {
                marker.setLatLng([lat, lng]);
              } else {
                marker = L.marker([lat, lng]).addTo(map)
                          .bindPopup('Current Vehicle Location')
                          .openPopup();
                map.setView([lat, lng], 15);
              }
            }
          }
        }

        fetchLocation();
        setInterval(fetchLocation, 5000);
      </script>
    </body>
    </html>
  `;
  res.send(html);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});