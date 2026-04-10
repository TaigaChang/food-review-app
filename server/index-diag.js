import express from "express";
import cors from "cors";
import dotenv from "dotenv";

console.log('[DIAG] === STARTING LOW-LEVEL DIAGNOSTICS ===');
console.log('[DIAG] Timestamp:', new Date().toISOString());
console.log('[DIAG] Node version:', process.version);
console.log('[DIAG] Platform:', process.platform);
console.log('[DIAG] CWD:', process.cwd());
console.log('[DIAG] Environment variables:');
console.log('[DIAG]  - PORT:', process.env.PORT);
console.log('[DIAG]  - NODE_ENV:', process.env.NODE_ENV);
console.log('[DIAG]  - DATABASE_URL:', process.env.DATABASE_URL ? '***' : 'NOT SET');
console.log('[DIAG]  - JWT_SECRET:', process.env.JWT_SECRET ? '***' : 'NOT SET');

console.log('[DIAG] Loading dotenv...');
dotenv.config();

console.log('[DIAG] Creating Express app...');
const app = express();

console.log('[DIAG] Adding CORS...');
app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:3000', 'https://food-review-app-rho.vercel.app'],
  credentials: true
}));
app.use(express.json());

console.log('[DIAG] Setting up diagnostic endpoint...');
app.get("/", (req, res) => {
  console.log('[DIAG] Root endpoint hit');
  res.json({ 
    message: "Diagnostic server running",
    timestamp: new Date().toISOString(),
    port: process.env.PORT
  });
});

app.get("/health", (req, res) => {
  console.log('[DIAG] Health endpoint hit');
  res.json({ ok: true });
});

console.log('[DIAG] Setting up error handlers...');
app.use((err, req, res, next) => {
  console.error('[DIAG] Error:', err);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 5000;
console.log(`[DIAG] About to listen on port ${PORT}...`);

try {
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`[DIAG] ✅ Server LISTENING on 0.0.0.0:${PORT}`);
    console.log(`[DIAG] Server object:`, server && server.listening ? 'LISTENING' : 'NOT LISTENING');
  });
  
  server.on('clientError', (err, socket) => {
    console.error('[DIAG] Client error:', err);
  });
} catch (err) {
  console.error('[DIAG] FAILED TO START SERVER:', err);
  process.exit(1);
}

process.on('uncaughtException', (err) => {
  console.error('[DIAG] UNCAUGHT:', err);
});
