import { Pool } from 'pg';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const useSSL = !process.env.DATABASE_URL.includes('localhost') &&
               !process.env.DATABASE_URL.includes('127.0.0.1');

export const rawPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: useSSL ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

rawPool.on('error', (err) => {
  console.error('Unexpected DB pool error:', err);
});

export async function query<T = any>(text: string, params?: any[]): Promise<T[]> {
  const client = await rawPool.connect();
  try {
    const result = await client.query(text, params);
    return result.rows as T[];
  } finally {
    client.release();
  }
}
