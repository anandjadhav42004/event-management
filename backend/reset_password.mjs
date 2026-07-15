import bcrypt from 'bcrypt';
import pg from 'pg';

const { Pool } = pg;
const pool = new Pool({ connectionString: 'postgresql://localhost:5432/rika_events' });

async function run() {
  try {
    const hash = await bcrypt.hash('Password123', 12);
    await pool.query("UPDATE users SET password_hash = $1 WHERE email = 'ninadthakur@gmail.com'", [hash]);
    console.log('Successfully reset password to: Password123');
  } catch (e) {
    console.error(e);
  } finally {
    pool.end();
  }
}
run();
