import mysql from "mysql2/promise";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment files
dotenv.config(); // Load .env (.env.local, etc)

// Check if explicitly in development mode
const isDevelopment = process.env.NODE_ENV === "development" || process.env.ENVIRONMENT === "development";
const isProduction = !isDevelopment; // Default to production

console.log(`[DB] Environment detection: NODE_ENV=${process.env.NODE_ENV}, isDevelopment=${isDevelopment}, isProduction=${isProduction}`);

// Load additional env file for production if needed
if (isProduction) {
  dotenv.config({ path: path.join(__dirname, ".env.production"), override: false });
  console.log(`[DB] Loaded production environment file`);
}

// Handle Railway DATABASE_URL format if provided
let dbHost, dbPort, dbUser, dbPassword, dbName;

if (process.env.DATABASE_URL) {
  // Parse DATABASE_URL format: mysql://user:password@host:port/database
  try {
    const url = new URL(process.env.DATABASE_URL);
    dbHost = url.hostname;
    dbPort = parseInt(url.port) || 3306;
    dbUser = url.username;
    dbPassword = url.password;
    dbName = url.pathname.slice(1); // Remove leading slash
  } catch (err) {
    console.error('[DB] Invalid DATABASE_URL format:', err.message);
  }
}

// If DATABASE_URL parsing failed or not provided, use individual env vars
if (!dbHost) {
  // For Railway: Try to use Railway's automatically injected DATABASE_URL
  // If not available, use our configured defaults
  
  // Production defaults (used on Railway)
  const PROD_DB_HOST = "hopper.proxy.rlwy.net";
  const PROD_DB_PORT = 38843;
  const PROD_DB_USER = "root";
  const PROD_DB_PASSWORD = "ptpSFGtnUkihtIqsrtfrflaGmAXjTmkl";
  const PROD_DB_NAME = "railway";

  // Development/Local defaults
  const DEV_DB_HOST = "localhost";
  const DEV_DB_PORT = 3306;
  const DEV_DB_USER = "root";
  const DEV_DB_PASSWORD = "";
  const DEV_DB_NAME = "food_review_app";

  if (isDevelopment) {
    // Local development mode
    dbHost = process.env.DB_HOST_LOCAL || DEV_DB_HOST;
    dbPort = parseInt(process.env.DB_PORT_LOCAL || DEV_DB_PORT);
    dbUser = process.env.DB_USER_LOCAL || DEV_DB_USER;
    dbPassword = process.env.DB_PASSWORD_LOCAL || DEV_DB_PASSWORD;
    dbName = process.env.DB_NAME_LOCAL || DEV_DB_NAME;
  } else {
    // Production mode (Railway)
    dbHost = process.env.DB_HOST || PROD_DB_HOST;
    dbPort = parseInt(process.env.DB_PORT || PROD_DB_PORT);
    dbUser = process.env.DB_USER || PROD_DB_USER;
    dbPassword = process.env.DB_PASSWORD || PROD_DB_PASSWORD;
    dbName = process.env.DB_NAME || PROD_DB_NAME;
  }
}

console.log(`[DB] Mode: ${isDevelopment ? 'DEVELOPMENT' : 'PRODUCTION'} | Connecting to: ${dbHost}:${dbPort}/${dbName}`);
console.log(`[DB] Connection config: user=${dbUser}, hasPassword=${!!dbPassword}`);

let pool;
try {
  pool = mysql.createPool({
    host: dbHost,
    user: dbUser,
    password: dbPassword,
    database: dbName,
    port: dbPort,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    connectTimeout: isProduction ? 30000 : 5000, // Increased to 30s for Railway
    idleTimeout: 30000,
  });
  console.log('[DB] Connection pool created successfully');
} catch (err) {
  console.error('[DB] Failed to create connection pool:', err.message);
  throw err;
}

// Error event listeners for pool
pool.on('error', (err) => {
  console.error('[DB] Pool error event:', err.message);
  console.error('[DB] Error code:', err.code);
  console.error('[DB] Full error:', err);
});

pool.on('connection', () => {
  console.log('[DB] New connection established');
});

// Test connection on startup with detailed logging
console.log('[DB] Attempting to test database connection...');
pool.query('SELECT COUNT(*) as cnt FROM restaurants')
  .then(([rows]) => {
    console.log(`[DB] ✅ Connected successfully! Found ${rows[0].cnt} restaurants`);
  })
  .catch(err => {
    console.error(`[DB] ❌ Connection test failed:`, err.message);
    console.error('[DB] Connection Error Details:', {
      code: err.code,
      errno: err.errno,
      sqlState: err.sqlState,
      message: err.message,
      sql: err.sql
    });
  });

export default pool;
