import pkg from 'pg';
const { Pool } = pkg;
import fs from 'fs';
import path from 'path';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function runMigrations() {
  const client = await pool.connect();
  try {
    console.log('Miqrasiya başladılır...');
    
    // Miqrasiya cədvəlini yaradırıq
    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const migrationsDir = path.join(process.cwd(), 'migrations');
    if (!fs.existsSync(migrationsDir)) {
      console.log('Miqrasiya qovluğu tapılmadı.');
      return;
    }

    const files = fs.readdirSync(migrationsDir).sort();

    for (const file of files) {
      if (file.endsWith('.sql')) {
        const res = await client.query('SELECT * FROM migrations WHERE name = $1', [file]);
        if (res.rows.length === 0) {
          console.log(`İcra olunur: ${file}`);
          const filePath = path.join(migrationsDir, file);
          const sql = fs.readFileSync(filePath, 'utf8');
          
          await client.query('BEGIN');
          try {
            await client.query(sql);
            await client.query('INSERT INTO migrations (name) VALUES ($1)', [file]);
            await client.query('COMMIT');
            console.log(`Uğurla tamamlandı: ${file}`);
          } catch (err) {
            await client.query('ROLLBACK');
            console.error(`Xəta baş verdi (${file}):`, err);
            throw err;
          }
        } else {
          console.log(`Artıq icra olunub: ${file}`);
        }
      }
    }
    console.log('Bütün miqrasiyalar uğurla bitdi!');
  } catch (err) {
    console.error('Miqrasiya zamanı ümumi xəta:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations();
