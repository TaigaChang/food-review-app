import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth-router.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

console.log('[TEST2] Express initialized');
console.log('[TEST2] Auth router imported');
app.use('/api/auth', authRoutes);
console.log('[TEST2] Auth routes mounted');

app.get("/", (req, res) => {
  res.json({ message: "Test server with auth routes" });
});

const PORT = 3333;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[TEST2] ✅ Server listening on 0.0.0.0:${PORT}`);
});
