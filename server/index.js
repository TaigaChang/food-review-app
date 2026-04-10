import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import authenticateToken from "./middleware/authenticate_token.js";
import authRoutes from "./routes/auth-router.js";
import restaurantsRouter from './routes/restaurants-router.js';
import reviewsRouter from './routes/reviews-router.js';

dotenv.config();
const app = express();

// Log startup info
console.log('[APP] Starting server... NODE_ENV =', process.env.NODE_ENV);
console.log('[APP] APP_PORT =', process.env.PORT || 'not set (will use default 5000)');

// CORS configuration for different environments
const corsOptions = {
  origin: function(origin, callback) {
    const allowedOrigins = [
      'http://localhost:3001',           // Local development
      'http://localhost:3000',           // Local testing
      'https://food-review-app-rho.vercel.app', // Production frontend
    ];
    
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Debug middleware to log all requests
app.use((req, res, next) => {
  // console.log(`${req.method} ${req.url}`);
  next();
});

// Mount routes
app.use('/api/auth', authRoutes);  // This mounts all auth routes under /api/auth

app.use('/api/restaurants', restaurantsRouter);

app.use('/api/reviews', reviewsRouter);

// Public health endpoint
app.get("/", (req, res) => {
  res.json({ message: "Backend is running!" });
});

// Development helper to get a test token
app.get("/api/dev/token", (req, res) => {
  if (process.env.NODE_ENV === "production") {
    return res.status(404).json({ message: "Not available in production" });
  }
  const testUser = { id: 1, email: "test@example.com" };
  const token = jwt.sign(testUser, process.env.JWT_SECRET || "dev-secret", { expiresIn: "1h" });
  res.json({ token, how_to_use: "Add header: Authorization: Bearer " + token });
});

// Example protected endpoint — requires a valid JWT
app.get("/api/protected", authenticateToken, (req, res) => {
  // `authenticateToken` attaches the decoded token payload to `req.user`.
  res.json({ message: "Protected route accessed", user: req.user });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`[APP] ✅ Server listening on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('[APP] SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('[APP] Server closed');
    process.exit(0);
  });
});