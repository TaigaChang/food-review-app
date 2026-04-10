import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

console.log('[TEST] Configuring middleware...');
app.use(cors());
app.use(express.json());

console.log('[TEST] Adding health endpoint...');
app.get("/", (req, res) => {
  console.log('[TEST] Health check received');
  res.json({ message: "Express works!" });
});

const PORT = process.env.PORT || 5000;
console.log(`[TEST] Starting on port ${PORT}...`);

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`[TEST] ✅ Server listening on 0.0.0.0:${PORT}`);
});
