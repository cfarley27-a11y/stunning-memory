const fs = require('fs');
const path = require('path');

const DATABASE_URL = process.env.DATABASE_URL;

let readAll;
let writeAll;

if (DATABASE_URL) {
  const { Pool } = require('pg');
  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  const ready = pool.query(`
    CREATE TABLE IF NOT EXISTS applications (
      id TEXT PRIMARY KEY,
      data JSONB NOT NULL
    )
  `);

  readAll = async () => {
    await ready;
    const { rows } = await pool.query("SELECT data FROM applications ORDER BY data->>'createdAt'");
    return rows.map((r) => r.data);
  };

  writeAll = async (applications) => {
    await ready;
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('TRUNCATE applications');
      for (const application of applications) {
        await client.query('INSERT INTO applications (id, data) VALUES ($1, $2)', [application.id, application]);
      }
      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  };
} else {
  const DB_PATH = path.join(__dirname, 'data', 'applications.json');

  readAll = async () => {
    if (!fs.existsSync(DB_PATH)) return [];
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw || '[]');
  };

  writeAll = async (applications) => {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify(applications, null, 2));
  };
}

module.exports = { readAll, writeAll };
