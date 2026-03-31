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

// Load additional env file for production if needed
if (isProduction) {
  dotenv.config({ path: path.join(__dirname, ".env.production"), override: false });
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
  // Railway external proxy connection (always use for consistency)
  const DEFAULT_DB_HOST = process.env.DB_HOST || process.env.RAILWAY_DB_HOST || "hopper.proxy.rlwy.net";
  const DEFAULT_DB_PORT = parseInt(process.env.DB_PORT || process.env.RAILWAY_DB_PORT || 38843);
  const DEFAULT_DB_USER = process.env.DB_USER || process.env.RAILWAY_DB_USER || "root";
  const DEFAULT_DB_PASSWORD = process.env.DB_PASSWORD || process.env.RAILWAY_DB_PASSWORD || "ptpSFGtnUkihtIqsrtfrflaGmAXjTmkl";
  const DEFAULT_DB_NAME = process.env.DB_NAME || process.env.RAILWAY_DB_NAME || "railway";

  // Local connection
  const LOCAL_DB_HOST = process.env.DB_HOST_LOCAL || "localhost";
  const LOCAL_DB_PORT = parseInt(process.env.DB_PORT_LOCAL || 3306);
  const LOCAL_DB_USER = process.env.DB_USER_LOCAL || "root";
  const LOCAL_DB_PASSWORD = process.env.DB_PASSWORD_LOCAL || "";
  const LOCAL_DB_NAME = process.env.DB_NAME_LOCAL || "food_review_app";

  dbHost = isDevelopment ? LOCAL_DB_HOST : DEFAULT_DB_HOST;
  dbPort = isDevelopment ? LOCAL_DB_PORT : DEFAULT_DB_PORT;
  dbUser = isDevelopment ? LOCAL_DB_USER : DEFAULT_DB_USER;
  dbPassword = isDevelopment ? LOCAL_DB_PASSWORD : DEFAULT_DB_PASSWORD;
  dbName = isDevelopment ? LOCAL_DB_NAME : DEFAULT_DB_NAME;
}

console.log(`[DB] Mode: ${isDevelopment ? 'DEVELOPMENT' : 'PRODUCTION'} | Connecting to: ${dbHost}:${dbPort}/${dbName}`);

const pool = mysql.createPool({
  host: dbHost,
  user: dbUser,
  password: dbPassword,
  database: dbName,
  port: dbPort,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  connectTimeout: isProduction ? 20000 : 5000,
});

// Error event listeners for pool
pool.on('error', (err) => {
  console.error('[DB] Pool error event:', err.message);
});

pool.on('connection', () => {
  console.log('[DB] New connection established');
});

// Test connection on startup
pool.query('SELECT COUNT(*) as cnt FROM restaurants')
  .then(([rows]) => {
    console.log(`[DB] ✅ Connected successfully! Found ${rows[0].cnt} restaurants`);
  })
  .catch(err => {
    console.error(`[DB] ❌ Connection test failed:`, err.message);
    console.error('[DB] Error details:', err);
  });

export default pool;
