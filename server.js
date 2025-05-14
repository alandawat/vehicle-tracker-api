const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;

// MongoDB connection string
const uri = 'mongodb+srv://alandawat:Aree@1122@tracker.1cepc0l.mongodb.net/?retryWrites=true&w=majority&appName=tracker';
const client = new MongoClient(uri);
let collection;

async function connectDB() {
  try {
    await client.connect();
    const db = client.db('tracker');
    collection = db.collection('locations');
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error(err);
  }
}

connectDB();

app.get('/api/update_location', async (req, res) => {
  const { imei, lat, lng } = req.query;
  const timestamp = new Date().toISOString();

  if (!imei || !lat || !lng) {
    return res.status(400).send('Missing parameters');
  }

  const locationData = { imei, lat, lng, timestamp };
  await collection.insertOne(locationData);
  console.log('Saved to MongoDB:', locationData);
  res.send('Location saved successfully');
});

app.get('/history/:imei', async (req, res) => {
  const imei = req.params.imei;
  const history = await collection.find({ imei }).sort({ timestamp: -1 }).toArray();
  res.json(history);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
