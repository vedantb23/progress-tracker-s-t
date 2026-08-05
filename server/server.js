const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const projectRoutes = require('./routes/projectRoutes');
const itemRoutes = require('./routes/itemRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(cors());
app.use(express.json());

app.use('/api/projects', projectRoutes);
app.use('/api/items', itemRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date(),
    mongoConnected: mongoose.connection.readyState === 1,
  });
});

const startExpressServer = () => {
  app
    .listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    })
    .on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is in use`);
      } else {
        console.error('Server error:', err);
      }
    });
};

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    startExpressServer();
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    startExpressServer();
  });
