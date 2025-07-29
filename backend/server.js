const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/commerceforge"
    );
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    return false;
  }
};

// Import routes
const authRoutes = require('./routes/auth/authRoutes');

// API Routes
app.use('/api/auth', authRoutes);

// Test MongoDB connection endpoint
app.get("/test-db", async (req, res) => {
  try {
    const isConnected = mongoose.connection.readyState === 1;
    if (isConnected) {
      res.json({
        success: true,
        message: "MongoDB is connected!",
        connection: {
          host: mongoose.connection.host,
          port: mongoose.connection.port,
          name: mongoose.connection.name,
          readyState: mongoose.connection.readyState,
        },
      });
    } else {
      res.status(500).json({
        success: false,
        message: "MongoDB is not connected",
        readyState: mongoose.connection.readyState,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Database test failed",
      error: error.message,
    });
  }
});

// Basic route
app.get("/", (req, res) => {
  res.json({
    message: "CommerceForge API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    endpoints: {
      auth: "/api/auth",
      health: "/health",
      dbTest: "/test-db"
    }
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  const health = {
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    database: {
      status:
        mongoose.connection.readyState === 1 ? "connected" : "disconnected",
      readyState: mongoose.connection.readyState,
    },
  };
  res.json(health);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Start server
const startServer = async () => {
  const dbConnected = await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`🔗 API URL: http://localhost:${PORT}`);
    console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
    console.log(`🧪 DB Test: http://localhost:${PORT}/test-db`);
    console.log(`🔐 Auth API: http://localhost:${PORT}/api/auth`);

    if (!dbConnected) {
      console.log(
        `⚠️  Warning: MongoDB is not connected. Some features may not work.`
      );
      console.log(
        `   Make sure MongoDB is running or check your MONGODB_URI in .env`
      );
    }
  });
};

startServer();
