import { Pool } from 'pg';

// Railway and other platforms provide DATABASE_URL
// Format: postgresql://user:password@host:port/database
const databaseUrl = process.env.DATABASE_URL;

const pool = new Pool(
  databaseUrl
    ? {
        connectionString: databaseUrl,
        ssl: process.env.NODE_ENV === 'production' ? {
          rejectUnauthorized: false, // Required for Railway/Heroku
        } : undefined,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      }
    : {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        database: process.env.DB_NAME || 'payperagent',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      }
);

pool.on('error', (err) => {
  console.error('❌ Unexpected database error:', err);
});

pool.on('connect', () => {
  console.log('✅ Database connection established');
});

export const query = async (text: string, params?: any[]) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.DEBUG_SQL === 'true') {
      console.log('📊 SQL Query:', { text, duration: `${duration}ms`, rows: res.rowCount });
    }
    return res;
  } catch (error) {
    console.error('❌ Database query error:', error);
    throw error;
  }
};

export const getClient = () => pool.connect();

export default pool;
