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
// Allow the Vite dev server (http://localhost:5173) to make credentialed requests
// during development. In production this should be restricted to your app origin.
const corsOptions = {
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
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
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});