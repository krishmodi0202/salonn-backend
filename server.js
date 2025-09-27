const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:3001', 'http://127.0.0.1:3001', 'http://localhost:3002', 'http://127.0.0.1:3002', 'https://salonn-frontend.vercel.app', 'https://salonn-admin.vercel.app'], 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection with enhanced options
console.log('🔗 Attempting to connect to MongoDB:', process.env.MONGODB_URI ? 'URI provided' : 'No URI provided');

const mongooseOptions = {
  serverSelectionTimeoutMS: 30000, // 30 seconds
  socketTimeoutMS: 45000
};

mongoose.connect(process.env.MONGODB_URI, mongooseOptions)
.then(() => {
  console.log('✅ Connected to MongoDB Atlas');
  console.log('📊 Database name:', mongoose.connection.name);
  console.log('📡 Connection state:', mongoose.connection.readyState);
  console.log('🌐 Host:', mongoose.connection.host);
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error.message);
  console.error('📝 Common fixes:');
  console.error('   1. Check IP whitelist in MongoDB Atlas Network Access');
  console.error('   2. Verify username/password in Database Access');
  console.error('   3. Ensure cluster is running and accessible');
  console.error('🔍 Error details:', error.name, error.code);
});

// Monitor connection events
mongoose.connection.on('connected', () => {
  console.log('🟢 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('🔴 Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('🟡 Mongoose disconnected from MongoDB');
});

// Routes
app.use('/api/bookings', require('./routes/bookings'));

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Barber Shop Backend API is running!' });
});

// Health check endpoint
app.get('/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStates = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: {
      state: dbStates[dbState],
      name: mongoose.connection.name || 'unknown'
    },
    environment: process.env.NODE_ENV || 'development'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 API available at: https://salonn-backend.onrender.com/api/bookings`);
});
