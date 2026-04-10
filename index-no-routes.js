// Test version - NO route imports, just basic endpoints
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

console.log('[TEST-NO-ROUTES] Starting');

dotenv.config();

const app = express();

app.use((req, res, next) => {
  console.log(`[REQ] → ${req.method} ${req.url}`);
  res.on('finish', () => {
    console.log(`[REQ] ← ${req.method} ${req.url} = ${res.statusCode}`);
  });
  next();
});

app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:3000', 'https://food-review-app-rho.vercel.app'],
  credentials: true
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Backend is running (no routes)" });
});

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.get("/test-echo/:msg", (req, res) => {
  res.json({ echo: req.params.msg });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Error
app.use((err, req, res, next) => {
  console.error('[ERROR]:', err.message);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`[TEST-NO-ROUTES] ✅ Listening on 0.0.0.0:${PORT}`);
});

process.on('uncaughtException', (err) => {
  console.error('[UNCAUGHT]:', err.message);
});
