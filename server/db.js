import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "food_review_app",
});

// Test connection on startup
const isProduction = process.env.NODE_ENV === "production";
if (!isProduction) {
  pool.query('SELECT COUNT(*) as cnt FROM restaurants')
    .then(([rows]) => {
      console.log(`[DB] ✅ Connected successfully! Found ${rows[0].cnt} restaurants`);
    })
    .catch(err => {
      console.error(`[DB] ❌ Connection test failed:`, err.message);
    });
}

export default pool;
