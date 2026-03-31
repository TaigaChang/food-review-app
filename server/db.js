import mysql from "mysql2/promise";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment files
dotenv.config(); // Load .env first

// Check if explicitly in development mode
const isDevelopment = process.env.NODE_ENV === "development" || process.env.ENVIRONMENT === "development";
const isProduction = !isDevelopment; // Default to production

// Load additional env file for production if needed
if (isProduction) {
  dotenv.config({ path: path.join(__dirname, ".env.production"), override: false });
}

// Railway external proxy connection (always use for data consistency)
const DEFAULT_DB_HOST = "hopper.proxy.rlwy.net";
const DEFAULT_DB_PORT = 38843;
const DEFAULT_DB_USER = "root";
const DEFAULT_DB_PASSWORD = "ptpSFGtnUkihtIqsrtfrflaGmAXjTmkl";
const DEFAULT_DB_NAME = "railway";

// Use defaults for production, local for development
const LOCAL_DB_HOST = "localhost";
const LOCAL_DB_PORT = 3306;
const LOCAL_DB_USER = "root";
const LOCAL_DB_PASSWORD = "";
const LOCAL_DB_NAME = "food_review_app";

const dbHost = isDevelopment ? (process.env.DB_HOST || LOCAL_DB_HOST) : (process.env.DB_HOST || DEFAULT_DB_HOST);
const dbPort = isDevelopment ? parseInt(process.env.DB_PORT || LOCAL_DB_PORT) : parseInt(process.env.DB_PORT || DEFAULT_DB_PORT);
const dbUser = isDevelopment ? (process.env.DB_USER || LOCAL_DB_USER) : (process.env.DB_USER || DEFAULT_DB_USER);
const dbPassword = isDevelopment ? (process.env.DB_PASSWORD || LOCAL_DB_PASSWORD) : (process.env.DB_PASSWORD || DEFAULT_DB_PASSWORD);
const dbName = isDevelopment ? (process.env.DB_NAME || LOCAL_DB_NAME) : (process.env.DB_NAME || DEFAULT_DB_NAME);

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

// Test connection on startup
if (isProduction) {
  pool.query('SELECT COUNT(*) as cnt FROM restaurants')
    .then(([rows]) => {
      console.log(`[DB] ✅ Connected successfully! Found ${rows[0].cnt} restaurants`);
    })
    .catch(err => {
      console.error(`[DB] ❌ Connection test failed:`, err.message);
    });
}

export default pool;
