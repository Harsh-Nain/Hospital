import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2"
import dotenv from "dotenv";
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "25856", 10),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: true, ca: process.env.DB_CA },
})

const db = drizzle(pool)

async function testConnection() {
  try {
    const [rows] = await db.execute("SELECT 1 + 1 AS result");
    console.log("DB Connection OK:", rows);
  } catch (err) {
    console.error("DB Connection Error:", err);
  }
}

testConnection();

export default db 