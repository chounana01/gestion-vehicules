const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const vehicleRoutes = require('./routes/vehicles');
require('dotenv').config();

const app = express();
const PORT = 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connecté'))
  .catch(err => console.error(err));

// ✅ CORRECTION ICI
app.use(cors());

app.use(express.json());

app.use('/vehicles', vehicleRoutes);

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});