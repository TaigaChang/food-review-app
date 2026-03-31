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
  next();
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantsRouter);
app.use('/api/reviews', reviewsRouter);

// Health endpoint
app.get("/", (req, res) => {
  res.json({ message: "Backend is running" });
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
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
