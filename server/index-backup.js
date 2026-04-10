import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

// Load environment variables FIRST thing
dotenv.config();

// Initialize app BEFORE importing routes (to avoid errors from route imports affecting startup)
const app = express();

// Import middleware and routes after app is created
import authenticateToken from "./middleware/authenticate_token.js";
import authRoutes from "./routes/auth-router.js";
import restaurantsRouter from './routes/restaurants-router.js';
import reviewsRouter from './routes/reviews-router.js';

// Log startup info
console.log('[APP] ========================================');
console.log('[APP] Server starting...');
console.log('[APP] NODE_ENV =', process.env.NODE_ENV || 'development');
console.log('[APP] PORT =', process.env.PORT || '5000 (default)');
console.log('[APP] ========================================');

// CORS configuration
const corsOptions = {
  origin: function(origin, callback) {
    const allowedOrigins = [
      'http://localhost:3001',
      'http://localhost:3000',
      'https://food-review-app-rho.vercel.app',
    ];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

// Middleware stack
try {
  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(cookieParser());
  console.log('[APP] Middleware configured');
} catch (err) {
  console.error('[APP] ERROR configuring middleware:', err.message);
  process.exit(1);
}

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[REQ] ${req.method} ${req.url}`);
  next();
});

// Health check endpoint (MUST be before route errors)
app.get("/", (req, res) => {
  try {
    res.json({ message: "Backend is running!" });
  } catch (err) {
    console.error('[APP] Error in health check:', err);
    res.status(500).json({ error: "Health check failed" });
  }
});

// Route mounting
try {
  app.use('/api/auth', authRoutes);
  app.use('/api/restaurants', restaurantsRouter);
  app.use('/api/reviews', reviewsRouter);
  console.log('[APP] Routes mounted successfully');
} catch (err) {
  console.error('[APP] ERROR mounting routes:', err);
  process.exit(1);
}

// Development helper to get a test token
app.get("/api/dev/token", (req, res) => {
  try {
    if (process.env.NODE_ENV === "production") {
      return res.status(404).json({ message: "Not available in production" });
    }
    const testUser = { id: 1, email: "test@example.com" };
    const token = jwt.sign(testUser, process.env.JWT_SECRET || "dev-secret", { expiresIn: "1h" });
    res.json({ token, how_to_use: "Add header: Authorization: Bearer " + token });
  } catch (err) {
    console.error('[APP] Error generating test token:', err);
    res.status(500).json({ error: "Failed to generate token" });
  }
});

// Example protected endpoint
app.get("/api/protected", authenticateToken, (req, res) => {
  try {
    res.json({ message: "Protected route accessed", user: req.user });
  } catch (err) {
    console.error('[APP] Error in protected route:', err);
    res.status(500).json({ error: "Protected route error" });
  }
});

// 404 handler - must come AFTER all routes
app.use((req, res) => {
  console.warn(`[APP] 404: ${req.method} ${req.url}`);
  res.status(404).json({ error: "Not found", path: req.url });
});

// Global error handler - must be LAST middleware (with 4 params)
app.use((err, req, res, next) => {
  console.error('[APP] ERROR middleware caught:', err.message);
  console.error('[APP] Stack:', err.stack);
  
  // Don't crash - respond with error
  res.status(500).json({ 
    error: err.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// Start server
const PORT = parseInt(process.env.PORT || '5000', 10);
let server;

try {
  server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`[APP] ✅ Server listening on 0.0.0.0:${PORT}`);
    console.log('[APP] Ready to accept connections');
  });
} catch (err) {
  console.error('[APP] FATAL: Failed to start server:', err.message);
  process.exit(1);
}

// Handle server errors
server.on('error', (err) => {
  console.error('[APP] Server error:', err);
  if (err.code === 'EADDRINUSE') {
    console.error(`[APP] Port ${PORT} is already in use`);
  }
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('[APP] SIGTERM received - shutting down gracefully');
  server.close(() => {
    console.log('[APP] Server closed');
    process.exit(0);
  });
});

// Log unhandled errors but DON'T EXIT (this kills the whole app and causes 502!)
process.on('uncaughtException', (err) => {
  console.error('[APP] UNCAUGHT EXCEPTION:', err.message);
  console.error('[APP] Stack:', err.stack);
  // App continues running
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[APP] UNHANDLED REJECTION:', reason);
  // App continues running
});