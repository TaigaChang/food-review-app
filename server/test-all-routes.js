import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth-router.js";
import restaurantsRouter from "./routes/restaurants-router.js";
import reviewsRouter from "./routes/reviews-router.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

console.log('[TEST3] Express initialized');
console.log('[TEST3] Mounting routes...');
app.use('/api/auth', authRoutes);
console.log('[TEST3] Auth routes mounted');
app.use('/api/restaurants', restaurantsRouter);
console.log('[TEST3] Restaurants routes mounted');
app.use('/api/reviews', reviewsRouter);
console.log('[TEST3] Reviews routes mounted');

app.get("/", (req, res) => {
  res.json({ message: "Test server with all routes" });
});

const PORT = 2222;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[TEST3] ✅ Server listening on 0.0.0.0:${PORT}`);
});
