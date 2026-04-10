// Diagnostic server with full request logging
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

console.log('[ROOT] Starting root entry point');

dotenv.config();

const app = express();

// Log all requests
app.use((req, res, next) => {
  console.log(`[REQ] → ${req.method} ${req.url} at ${new Date().toISOString()}`);
  
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

// Health check
app.get("/", (req, res) => {
  console.log('[HANDLER] Root handler executing');
  try {
    res.json({ message: "Backend is running!" });
    console.log('[HANDLER] Root response sent');
  } catch (err) {
    console.error('[HANDLER] Root error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/health", (req, res) => {
  console.log('[HANDLER] Health handler executing');
  res.json({ ok: true });
});

// Routes from server
console.log('[ROOT] Importing routes...');
try {
  const { default: authRoutes } = await import('./server/routes/auth-router.js');
  const { default: restaurantsRouter } = await import('./server/routes/restaurants-router.js');
  const { default: reviewsRouter } = await import('./server/routes/reviews-router.js');
  
  console.log('[ROOT] Routes imported, mounting...');
  app.use('/api/auth', authRoutes);
  app.use('/api/restaurants', restaurantsRouter);
  app.use('/api/reviews', reviewsRouter);
  console.log('[ROOT] Routes mounted');
} catch (err) {
  console.error('[ROOT] Error importing routes:', err.message);
  console.error('[ROOT] Stack:', err.stack);
}

// 404
app.use((req, res) => {
  console.log('[404] No route matched');
  res.status(404).json({ error: "Not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('[ERROR] Caught error:', err.message);
  console.error('[ERROR] Stack:', err.stack);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 5000;
console.log(`[ROOT] Creating server on port ${PORT}...`);

try {
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`[ROOT] ✅ Server LISTENING on 0.0.0.0:${PORT}`);
    console.log(`[ROOT] Ready to accept requests`);
  });
  
  server.on('error', (err) => {
    console.error('[ROOT] Server error:', err);
  });
  
  server.on('clientError', (err, socket) => {
    console.error('[ROOT] Client error:', err);
  });
} catch (err) {
  console.error('[ROOT] FAILED TO START:', err.message);
  process.exit(1);
}

process.on('uncaughtException', (err) => {
  console.error('[ROOT] UNCAUGHT EXCEPTION:', err.message);
  console.error('[ROOT] Stack:', err.stack);
});

process.on('unhandledRejection', (reason) => {
  console.error('[ROOT] UNHANDLED REJECTION:', reason);
});
