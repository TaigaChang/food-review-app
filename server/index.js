import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === "production";

// Load environment file first
try {
  if (isProduction) {
    dotenv.config({ path: path.join(__dirname, ".env.production") });
  } else {
    dotenv.config();
  }
} catch (e) {
  console.warn("No .env file found, using environment variables");
}

const app = express();

// CORS configuration with proper origin handling
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      'https://food-review-app-rho.vercel.app',
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001'
    ];
    
    // Allow requests with no origin (like mobile apps or curl requests)
    // Also allow in development
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      // In production, still allow but log it
      console.log(`[CORS] Request from origin: ${origin}`);
      callback(null, true); // Still allow to avoid 502 errors
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200, // For compatibility with older browsers
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Health endpoint - always available
app.get("/", (req, res) => {
  res.json({ message: "Backend is running", date: new Date().toISOString() });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Test endpoint to verify routing works
app.get("/api/test", (req, res) => {
  res.json({ message: "Test endpoint works", routesReady: true });
});

// Debug endpoint - shows server status
app.get("/api/debug/status", async (req, res) => {
  try {
    const dbTest = await import('./db.js').then(m => m.testConnection());
    res.json({ 
      status: "ok", 
      environment: process.env.NODE_ENV,
      routesReady,
      database: dbTest,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.json({
      status: "ok",
      environment: process.env.NODE_ENV,
      routesReady,
      database: { success: false, error: err.message },
      timestamp: new Date().toISOString()
    });
  }
});

// Protected endpoint
app.get("/api/protected", (req, res) => {
  // This is a simple protected endpoint for dev
  if (process.env.NODE_ENV === "production") {
    return res.status(404).json({ message: "Not available in production" });
  }
  res.json({ message: "Protected route accessed" });
});

// Dev token endpoint
app.get("/api/dev/token", (req, res) => {
  if (process.env.NODE_ENV === "production") {
    return res.status(404).json({ message: "Not available in production" });
  }
  const testUser = { id: 1, email: "test@example.com" };
  const token = jwt.sign(testUser, process.env.JWT_SECRET || "dev-secret", { expiresIn: "1h" });
  res.json({ token, how_to_use: "Add header: Authorization: Bearer " + token });
});

// Import routes after server setup
let authRoutes, restaurantsRouter, reviewsRouter;
let dbReady = false;
let dbError = null;
let routesReady = false;

// Try to import and initialize routes asynchronously
const initializeRoutes = async () => {
  try {
    // Import routes
    authRoutes = (await import('./routes/auth-router.js')).default;
    restaurantsRouter = (await import('./routes/restaurants-router.js')).default;
    reviewsRouter = (await import('./routes/reviews-router.js')).default;
    
    // Mount routes BEFORE error handlers!
    app.use('/api/auth', authRoutes);
    app.use('/api/restaurants', restaurantsRouter);
    app.use('/api/reviews', reviewsRouter);
    
    routesReady = true;
    console.log("Routes initialized and mounted successfully");
  } catch (err) {
    dbError = err;
    console.error("Error initializing routes:", err.message, err.stack);
    // Don't crash - serve health check only
  }
};

// Initialize routes BEFORE starting the server
(async () => {
  await initializeRoutes();
  
  // Error handler (after all routes)
  app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ 
      error: "Internal server error", 
      message: process.env.NODE_ENV === "production" ? "Error processing request" : err.message 
    });
  });

  // 404 handler (LAST - catches all unmatched routes)
  app.use((req, res) => {
    res.status(404).json({ error: "Not found" });
  });

  const PORT = process.env.PORT || 5000;
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server started on port ${PORT}`);
    console.log(`Time: ${new Date().toISOString()}`);
    console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
    console.log(`Routes ready: ${routesReady ? 'YES' : 'NO'}`);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM received, gracefully shutting down');
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  });
})();

export default app;
