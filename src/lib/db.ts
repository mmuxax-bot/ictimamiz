import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Supabase SSL bağlantı xətalarının qarşısını almaq üçün konfiqurasiya
const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

export default pool;
