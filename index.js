import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import authenticateToken from "./server/middleware/authenticate_token.js";
import authRoutes from "./server/routes/auth-router.js";
import restaurantsRouter from './server/routes/restaurants-router.js';
import reviewsRouter from './server/routes/reviews-router.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === "production";

// Load environment file
if (isProduction) {
  dotenv.config({ path: path.join(__dirname, ".env.production") });
} else {
  dotenv.config();
}

const app = express();

const corsOptions = {
  origin: process.env.CLIENT_ORIGIN || ['https://food-review-app-rho.vercel.app', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Debug middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Startup information
console.log(`[CONFIG] NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`[CONFIG] CLIENT_ORIGIN: ${process.env.CLIENT_ORIGIN || 'https://food-review-app-rho.vercel.app'}`);
console.log(`[CONFIG] PORT: ${process.env.PORT || 5000}`);

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantsRouter);
app.use('/api/reviews', reviewsRouter);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({ message: "Backend is running", environment: process.env.NODE_ENV });
});

// Configuration debug endpoint (without sensitive info)
app.get("/api/debug/config", (req, res) => {
  res.json({
    node_env: process.env.NODE_ENV,
    port: process.env.PORT || 5000,
    has_client_origin: !!process.env.CLIENT_ORIGIN,
    has_db_host: !!process.env.DB_HOST,
    has_database_url: !!process.env.DATABASE_URL,
    timestamp: new Date().toISOString()
  });
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

// Protected endpoint
app.get("/api/protected", authenticateToken, (req, res) => {
  res.json({ message: "Protected route accessed", user: req.user });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`[STARTUP] Server started successfully at ${new Date().toISOString()}`);
});

// Handle unhandled errors
process.on('uncaughtException', (err) => {
  console.error('[ERROR] Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[ERROR] Unhandled Rejection at:', promise, 'reason:', reason);
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('[SHUTDOWN] SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('[SHUTDOWN] Server closed');
    process.exit(0);
  });
});
