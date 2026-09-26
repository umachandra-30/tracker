require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const { connectDB, ensureDbConnected } = require('./config/db');
const driveRoutes = require('./routes/driveRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));

// Database Status Health Check Endpoint (Bypasses connection middleware for diagnostic monitoring)
app.get('/api/health', (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  const states = ['Disconnected', 'Connected', 'Connecting', 'Disconnecting'];
  res.json({
    status: 'ok',
    database: isConnected ? 'MongoDB Atlas Connected' : `MongoDB Atlas ${states[mongoose.connection.readyState] || 'Unknown'}`,
    dbState: mongoose.connection.readyState
  });
});

// Enforce MongoDB Atlas connection readiness on all database API endpoints
app.use('/api', ensureDbConnected);

// API Routes
app.use('/api/drives', driveRoutes);

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Initiate MongoDB Atlas Connection and Start Express Server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Placement Drive Tracker server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('⚠️ Initial MongoDB Atlas connection pending/warning:', err.message);
    app.listen(PORT, () => {
      console.log(`🚀 Placement Drive Tracker server running at http://localhost:${PORT} (Database connection initializing)`);
    });
  });
