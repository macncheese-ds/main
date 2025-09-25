import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || process.env.DB_PASS || '',
  database: process.env.DB_NAME || process.env.DB_DATABASE,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;
