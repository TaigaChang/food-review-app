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

console.log("[STARTUP] Starting application...");
console.log("[STARTUP] NODE_ENV:", process.env.NODE_ENV);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === "production";

// Load environment variables
try {
  if (isProduction) {
    const envPath = path.join(__dirname, "server", ".env.production");
    console.log("[STARTUP] Loading prod env from:", envPath);
    const result = dotenv.config({ path: envPath });
    if (result.error) console.log("[STARTUP] .env.production not found:", result.error.message);
  } else {
    dotenv.config();
  }
} catch (error) {
  console.log("[STARTUP] Error loading env:", error.message);
}

console.log("[STARTUP] Creating Express app...");
const app = express();

const corsOptions = {
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:3001',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Mount routes
console.log("[STARTUP] Mounting routes...");
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

const PORT = process.env.PORT || 5000;
console.log("[STARTUP] Starting server on port:", PORT);
app.listen(PORT, () => {
  console.log("[STARTUP] ✅ Server running on port " + PORT);
});
