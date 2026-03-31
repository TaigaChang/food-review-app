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

// Use Railway internal connection in production if env vars not set
const dbHost = process.env.DB_HOST || (isProduction ? RAILWAY_DB_HOST : "localhost");
const dbPort = parseInt(process.env.DB_PORT || (isProduction ? RAILWAY_DB_PORT : 3306));
const dbUser = process.env.DB_USER || (isProduction ? RAILWAY_DB_USER : "root");
const dbPassword = process.env.DB_PASSWORD || (isProduction ? RAILWAY_DB_PASSWORD : "");
const dbName = process.env.DB_NAME || (isProduction ? RAILWAY_DB_NAME : "food_review_app");

console.log(`[DB] Connecting to: ${dbHost}:${dbPort}/${dbName}`);

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
  keepAliveInitialDelayMs: 0,
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
