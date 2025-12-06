import { Pool } from 'pg';

export const pool = new Pool({
  connectionString:
    'postgresql://neondb_owner:npg_xoq4uLYCP6Wd@ep-restless-bar-adc4d8ij-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
});

const initDb = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE ,
        password TEXT NOT NULL,
        phone VARCHAR(20) NOT NULL,
        role VARCHAR(20) NOT NULL 
      );
    `);

    console.log('Database initialized successfully!');
  } catch (error: any) {
    console.error('DB Error:', error.message);
  }
};

export { initDb };
