const dotenv = require('dotenv');
const { Pool } = require('pg');

// Load environment variables from .env file
dotenv.config();

const pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.DBPORT,
});

pool.on('connect', () => {
  console.log('Database connected');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});


 
(async () => {
  try {
    // Create table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        uid SERIAL PRIMARY KEY,
        name TEXT NOT NULL
      )
    `);

    // Insert a user
    await pool.query(
      `INSERT INTO users (name) VALUES ($1)`,
      ['Mohan']
    ); 

    // Fetch all users
    const res = await pool.query(`SELECT * FROM users`);
    console.log('Users:', res.rows);

  } catch (err) {
    console.error('Database query failed:', err);
  } finally {
    await pool.end();
  }
})();