import pg from 'pg';
const { Pool } = pg;
const pool = new Pool({ connectionString: 'postgresql://localhost:5432/rika_events' });

async function run() {
  try {
    const res = await pool.query('SELECT id, name, email, password_hash, role FROM users');
    console.log(res.rows);
  } catch (e) {
    console.error(e);
  } finally {
    pool.end();
  }
}
run();
