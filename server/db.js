import mysql from "mysql2/promise";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === "production";

// Load environment file based on NODE_ENV  
if (isProduction) {
  dotenv.config({ path: path.join(__dirname, ".env.production") });
} else {
  dotenv.config();
}

// Railway external proxy connection (works from outside Railway network)
const RAILWAY_DB_HOST = "hopper.proxy.rlwy.net";
const RAILWAY_DB_PORT = 38843;
const RAILWAY_DB_USER = "root";
const RAILWAY_DB_PASSWORD = "ptpSFGtnUkihtIqsrtfrflaGmAXjTmkl";
const RAILWAY_DB_NAME = "railway";

// Prefer production credentials if connecting from Railway environment
// (Check for RAILWAY_ENVIRONMENT_NAME which is set by Railway)
const shouldUseProduction = isProduction || !!process.env.RAILWAY_ENVIRONMENT_NAME;

// Use Railway external connection if in production/railway environment, otherwise use local
const dbHost = process.env.DB_HOST || (shouldUseProduction ? RAILWAY_DB_HOST : "localhost");
const dbPort = parseInt(process.env.DB_PORT || (shouldUseProduction ? RAILWAY_DB_PORT : 3306));
const dbUser = process.env.DB_USER || (shouldUseProduction ? RAILWAY_DB_USER : "root");
const dbPassword = process.env.DB_PASSWORD || (shouldUseProduction ? RAILWAY_DB_PASSWORD : "");
const dbName = process.env.DB_NAME || (shouldUseProduction ? RAILWAY_DB_NAME : "food_review_app");

console.log(`[DB] Env: ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'} | Host: ${dbHost}:${dbPort} | DB: ${dbName}`);

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
