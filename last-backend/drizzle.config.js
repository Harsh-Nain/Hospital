import dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

dotenv.config();

export default defineConfig({
  schema: "./db/schema.js",
  out: "./drizzle",
  dialect: "mysql",
  dbCredentials: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 25856),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
      rejectUnauthorized: true,
      ca: process.env.DB_CA
    }
  }
});