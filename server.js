const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/api/update_location', (req, res) => {
  const { imei, lat, lng } = req.query;
  console.log(`Received: IMEI=${imei}, Latitude=${lat}, Longitude=${lng}`);
  res.send('Location saved successfully');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});