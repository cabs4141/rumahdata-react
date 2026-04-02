require('dotenv').config({ path: '../rumah-data-be/.env' });
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function checkRows() {
  try {
    const res = await pool.query('SELECT COUNT(*) FROM public.ptk');
    console.log(`DB Count: ${res.rows[0].count}`);
  } catch(e) {
    console.error(e);
  } finally {
    pool.end();
  }
}

checkRows();
