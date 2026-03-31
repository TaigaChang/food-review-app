import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

const pool = mysql.createPool({
  host: isProduction ? process.env.DB_HOST : (process.env.DB_HOST || "localhost"),
  user: isProduction ? process.env.DB_USER : (process.env.DB_USER || "root"),
  password: isProduction ? process.env.DB_PASSWORD : (process.env.DB_PASSWORD || ""),
  database: isProduction ? process.env.DB_NAME : (process.env.DB_NAME || "food_review_app"),
  port: isProduction ? parseInt(process.env.DB_PORT) : (process.env.DB_PORT || 3306),
});

export default pool;
