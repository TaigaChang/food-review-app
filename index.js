import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

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
  origin: (origin, callback) => {
    const allowedOrigins = [
      'https://food-review-app-rho.vercel.app',
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001'
    ];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log(`[CORS] Rejecting origin: ${origin}`);
      callback(new Error('CORS not allowed'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
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
console.log(`[CONFIG] PORT: ${process.env.PORT || 5000}`);

// Health check endpoint (doesn't need database)
app.get("/health", (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Root endpoint (doesn't need database)
app.get("/", (req, res) => {
  res.json({ message: "Backend is running", environment: process.env.NODE_ENV });
});

// Initialize database and routes
let dbInitialized = false;
let poolInstance = null;

async function initializeDatabase() {
  try {
    console.log('[SERVER] Initializing database...');
    
    // Import the pool module
    const poolModule = await import('./server/db.js');
    poolInstance = poolModule.default;
    
    // Import route modules  
    const authRouter = (await import('./server/routes/auth-router.js')).default;
    const restaurantsRouter = (await import('./server/routes/restaurants-router.js')).default;
    const reviewsRouter = (await import('./server/routes/reviews-router.js')).default;
    const authenticateToken = (await import('./server/middleware/authenticate_token.js')).default;
    
    // Mount API routes
    app.use('/api/auth', authRouter);
    app.use('/api/restaurants', restaurantsRouter);
    app.use('/api/reviews', reviewsRouter);
    
    // Protected endpoint
    app.get("/api/protected", authenticateToken, (req, res) => {
      res.json({ message: "Protected route accessed", user: req.user });
    });
    
    dbInitialized = true;
    console.log('[SERVER] Database and routes initialized successfully');
  } catch (error) {
    console.error('[SERVER] Failed to initialize database:', error.message);
    console.error('[SERVER] Error:', error);
    // Don't exit - server can still respond with error
  }
}

// Status endpoint
app.get("/api/debug/status", (req, res) => {
  res.json({
    server_running: true,
    database_initialized: dbInitialized,
    node_env: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Start server first
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`[SERVER] Express server listening on port ${PORT}`);
  console.log(`[SERVER] Listening on 0.0.0.0:${PORT}`);
  console.log(`[STARTUP] Server started successfully at ${new Date().toISOString()}`);
  
  // Initialize database after server is listening
  initializeDatabase();
});

// Error handlers
process.on('uncaughtException', (err) => {
  console.error('[ERROR] Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[ERROR] Unhandled Rejection:', reason);
});

process.on('SIGTERM', () => {
  console.log('[SHUTDOWN] SIGTERM received');
  server.close(() => {
    console.log('[SHUTDOWN] Server closed');
    process.exit(0);
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
