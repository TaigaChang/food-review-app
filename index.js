import express from "express";
import cors from "cors";
import dotenv from "dotenv";

const PORT = process.env.PORT || 5000;

// Try to load .env but don't fail if it doesn't exist
try {
  dotenv.config({ override: false });
} catch (err) {
  // Ignore - might not have .env on Railway
}

const app = express();

// Simple CORS
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// Health endpoint - guaranteed to always work
app.get('/health', (req, res) => {
  res.json({ ok: true, port: PORT });
});

app.get('/', (req, res) => {
  res.json({ message: 'Backend running', port: PORT });
});

// Start server  
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`[${new Date().toISOString()}] Server listening on port ${PORT}`);
});

// Load API routes asynchronously  
setTimeout(() => {
  (async () => {
    try {
      const { default: pool } = await import('./server/db.js');
      const [rows] = await pool.query('SELECT COUNT(*) as cnt FROM restaurants');
      console.log(`Restaurants: ${rows[0].cnt}`);
      
      const authRouter = (await import('./server/routes/auth-router.js')).default;
      const restaurantsRouter = (await import('./server/routes/restaurants-router.js')).default;
      const reviewsRouter = (await import('./server/routes/reviews-router.js')).default;
      
      app.use('/api/auth', authRouter);
      app.use('/api/restaurants', restaurantsRouter);
      app.use('/api/reviews', reviewsRouter);
      
      console.log('Routes mounted');
    } catch (e) {
      console.error('Route loading error:', e.message);
    }
  })();
}, 500);

process.on('uncaughtException', (e) => console.error('Uncaught:', e.message));
process.on('unhandledRejection', (e) => console.error('Unhandled:', e));
