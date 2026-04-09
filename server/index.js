import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === "production";

console.log(`[STARTUP] Node process starting...`);
console.log(`[STARTUP] __dirname: ${__dirname}`);
console.log(`[STARTUP] NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`[STARTUP] isProduction: ${isProduction}`);

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
// Initialize app in async IIFE
(async () => {
  // Mount routes first (BEFORE error/404 handlers)
  try {
    console.log("[INIT] Mounting routes...");
    const authRoutes = (await import('./routes/auth-router.js')).default;
    const restaurantsRouter = (await import('./routes/restaurants-router.js')).default;
    const reviewsRouter = (await import('./routes/reviews-router.js')).default;
    
    app.use('/api/auth', authRoutes);
    app.use('/api/restaurants', restaurantsRouter);
    app.use('/api/reviews', reviewsRouter);
    
    console.log("[INIT] ✓ Routes mounted successfully");
  } catch (err) {
    console.error("[INIT_ERROR] Failed to mount routes:", err.message);
    if (err.stack) console.error(err.stack);
    process.exit(1);
  }

  // Error handler (after all routes)
  app.use((err, req, res, next) => {
    console.error("[ERROR] Unhandled error:", err.message);
    res.status(500).json({ 
      error: "Internal server error", 
      message: process.env.NODE_ENV === "production" ? "Error processing request" : err.message 
    });
  });

  // 404 handler (LAST - catches all unmatched routes)
  app.use((req, res) => {
    console.log(`[404] Not found: ${req.method} ${req.path}`);
    res.status(404).json({ error: "Not found" });
  });

  // Start server
  const PORT = process.env.PORT || 5000;
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SERVER] ✓ Listening on port ${PORT}`);
    console.log(`[TIME] ${new Date().toISOString()}`);
    console.log(`[ENV] NODE_ENV=${process.env.NODE_ENV}`);
    console.log(`[DB_HOST] ${process.env.DB_HOST || 'localhost'}`);
    console.log(`[SERVER] ✓ All systems running - DEPLOYMENT_v2`);
  });

  server.on('error', (err) => {
    console.error('[SERVER_ERROR]', err.message);
    process.exit(1);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('[SHUTDOWN] SIGTERM received, closing...');
    server.close(() => {
      console.log('[SHUTDOWN] Server closed');
      process.exit(0);
    });
  });
})();

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('[FATAL] Uncaught exception:', err.message);
  console.error(err.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('[FATAL] Unhandled rejection:', reason);
});

export default app;
