import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'clinica_invasivos',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: '+00:00',
  connectTimeout: 60000,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000
};

const pool = mysql.createPool(dbConfig);

export const query = async (sql, params) => {
  const [rows] = await pool.execute(sql, params);
  return rows;
};

export const getConnection = async () => {
  return await pool.getConnection();
};

export const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
};

export default pool;
