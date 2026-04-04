import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 5000;

// Load env files
try {
  if (process.env.NODE_ENV === "production") {
    const envPath = path.join(__dirname, "server/.env.production");
    dotenv.config({ path: envPath, override: false });
  }
  dotenv.config({ override: false });
} catch (err) {
  console.error('[ENV] Failed to load env files:', err.message);
}

console.log(`[${new Date().toISOString()}] Starting server...`);
console.log(`[CONFIG] NODE_ENV=${process.env.NODE_ENV}, PORT=${PORT}`);

const app = express();

// CORS
app.use(cors({
  origin: ['https://food-review-app-rho.vercel.app', 'http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Always-working endpoints
app.get('/health', (req, res) => {
  res.json({ status: 'ok', port: PORT, time: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.json({ message: 'Backend running', port: PORT, env: process.env.NODE_ENV });
});

app.get('/api/debug/config', (req, res) => {
  res.json({
    port: PORT,
    node_env: process.env.NODE_ENV,
    db_host: process.env.DB_HOST || 'NOT SET',
    db_port: process.env.DB_PORT || 'NOT SET',
    time: new Date().toISOString()
  });
});

// Start server FIRST
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`[SUCCESS] Server listening on 0.0.0.0:${PORT}`);
});

// Load routes AFTER server starts
setTimeout(() => {
  (async () => {
    try {
      console.log('[ROUTES] Loading database...');
      const { default: pool } = await import('./server/db.js');
      
      console.log('[ROUTES] Testing database...');
      const [count] = await pool.query('SELECT COUNT(*) as cnt FROM restaurants');
      console.log(`[DB] ✅ Found ${count[0].cnt} restaurants`);
      
      console.log('[ROUTES] Loading endpoints...');
      const authRouter = (await import('./server/routes/auth-router.js')).default;
      const restaurantsRouter = (await import('./server/routes/restaurants-router.js')).default;
      const reviewsRouter = (await import('./server/routes/reviews-router.js')).default;
      
      app.use('/api/auth', authRouter);
      app.use('/api/restaurants', restaurantsRouter);
      app.use('/api/reviews', reviewsRouter);
      
      console.log('[SUCCESS] All routes loaded');
    } catch (err) {
      console.error('[ERROR]', err.message);
      if (err.stack) console.error(err.stack);
    }
  })();
}, 100);

// Error handling
process.on('uncaughtException', (err) => {
  console.error('[FATAL]', err.message);
});

process.on('unhandledRejection', (reason) => {
  console.error('[REJECTION]', reason);
});
