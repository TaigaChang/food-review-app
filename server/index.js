import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth-router.js";
import restaurantsRouter from "./routes/restaurants-router.js";
import reviewsRouter from "./routes/reviews-router.js";

// Load env
dotenv.config();

// Create app
const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3001',
    'http://localhost:3000',
    'https://food-review-app-rho.vercel.app'
  ],
  credentials: true
}));
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Backend is running!" });
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantsRouter);
app.use('/api/reviews', reviewsRouter);

// 404
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('[APP] Error:', err.message);
  res.status(500).json({ error: err.message });
});

// Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[APP] Server listening on 0.0.0.0:${PORT}`);
});

// Handle crashes gracefully
process.on('uncaughtException', (err) => {
  console.error('[APP] Uncaught exception:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('[APP] Unhandled rejection:', err);
});
