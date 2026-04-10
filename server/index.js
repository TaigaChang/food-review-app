import express from "express";
import cors from "cors";
import dotenv from "dotenv";

console.log('[APP] Init starting at', new Date().toISOString());

dotenv.config();

const app = express();

console.log('[APP] Middleware setup...');
app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:3000', 'https://food-review-app-rho.vercel.app'],
  credentials: true
}));
app.use(express.json());

console.log('[APP] Request logger setup...');
app.use((req, res, next) => {
  const time = new Date().toISOString();
  console.log(`[REQUEST] ${time} → ${req.method} ${req.url}`);
  
  res.on('finish', () => {
    console.log(`[RESPONSE] ${time} ← ${req.method} ${req.url} status=${res.statusCode}`);
  });
  
  res.on('error', (err) => {
    console.error(`[RESPONSE_ERROR] ${req.method} ${req.url}:`, err.message);
  });
  
  next();
});

// Test endpoint - no dependencies
app.get("/", (req, res) => {
  try {
    console.log('[HANDLER] / - responding');
    res.json({ message: "Backend is running!" });
  } catch (err) {
    console.error('[HANDLER] / error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.get("/health", (req, res) => {
  try {
    console.log('[HANDLER] /health - responding');
    res.json({ ok: true, timestamp: new Date().toISOString() });
  } catch (err) {
    console.error('[HANDLER] /health error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Railway health checks (various endpoints)
app.head("/health", (req, res) => res.status(200).end());
app.head("/", (req, res) => res.status(200).end());

// Try to load routes
console.log('[APP] Attempting to import routes...');
let routesLoaded = false;

try {
  console.log('[APP] Importing auth-router...');
  const authRoutes = (await import('./routes/auth-router.js')).default;
  console.log('[APP] ✅ auth-router imported');

  console.log('[APP] Importing restaurants-router...');
  const restaurantsRouter = (await import('./routes/restaurants-router.js')).default;
  console.log('[APP] ✅ restaurants-router imported');

  console.log('[APP] Importing reviews-router...');
  const reviewsRouter = (await import('./routes/reviews-router.js')).default;
  console.log('[APP] ✅ reviews-router imported');

  console.log('[APP] Mounting routes...');
  app.use('/api/auth', authRoutes);
  app.use('/api/restaurants', restaurantsRouter);
  app.use('/api/reviews', reviewsRouter);
  console.log('[APP] ✅ All routes mounted');
  
  routesLoaded = true;
} catch (err) {
  console.error('[APP] ⚠️ Failed to load routes:', err.message);
  console.error('[APP] Stack:', err.stack);
  console.log('[APP] App will serve health endpoints only');
}

// 404
app.use((req, res) => {
  console.log('[404] No route matched for', req.method, req.url);
  res.status(404).json({ error: "Not found", path: req.url });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('[GLOBAL_ERROR]', err.message);
  console.error('[GLOBAL_ERROR] Stack:', err.stack);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 5000;
console.log(`[APP] Starting server on port ${PORT}...`);

try {
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`[APP] ✅ Server LISTENING on 0.0.0.0:${PORT}`);
    console.log(`[APP] Routes loaded: ${routesLoaded}`);
    console.log(`[APP] Ready to accept connections`);
  });

  server.on('error', (err) => {
    console.error('[SERVER_ERROR]', err);
  });
} catch (err) {
  console.error('[STARTUP_ERROR] Failed to start server:', err.message);
  process.exit(1);
}

process.on('uncaughtException', (err) => {
  console.error('[UNCAUGHT_EXCEPTION]', err.message);
  console.error('[UNCAUGHT_EXCEPTION] Stack:', err.stack);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[UNHANDLED_REJECTION]', reason);
});
