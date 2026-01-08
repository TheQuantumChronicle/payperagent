const { Pool } = require('pg');
require('dotenv').config();

console.log('🔍 Testing PostgreSQL Connection...\n');

// Check if DATABASE_URL is set (Railway/production)
if (process.env.DATABASE_URL) {
  console.log('✅ Using DATABASE_URL (Railway/Production)');
  console.log('URL:', process.env.DATABASE_URL.replace(/:[^:@]+@/, ':****@')); // Hide password
} else {
  console.log('📝 Using individual connection parameters:');
  console.log('DB_HOST:', process.env.DB_HOST);
  console.log('DB_PORT:', process.env.DB_PORT);
  console.log('DB_NAME:', process.env.DB_NAME);
  console.log('DB_USER:', process.env.DB_USER);
  console.log('DB_PASSWORD:', process.env.DB_PASSWORD === '' ? '(empty string)' : '****');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Fallback to individual params if DATABASE_URL not set
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'payperagent',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});

console.log('\n🔌 Testing connection...\n');

pool.query('SELECT NOW(), version()', async (err, res) => {
  if (err) {
    console.error('❌ Connection failed:', err.message);
    console.error('Error details:', err);
    pool.end();
    process.exit(1);
  } else {
    console.log('✅ Connection successful!');
    console.log('📅 Server time:', res.rows[0].now);
    console.log('🗄️  PostgreSQL version:', res.rows[0].version.split(',')[0]);
    
    // Test table creation
    console.log('\n📊 Testing table operations...');
    try {
      await pool.query('CREATE TABLE IF NOT EXISTS test_connection (id SERIAL PRIMARY KEY, created_at TIMESTAMP DEFAULT NOW())');
      console.log('✅ Table creation successful');
      
      await pool.query('INSERT INTO test_connection DEFAULT VALUES RETURNING *');
      console.log('✅ Insert successful');
      
      const result = await pool.query('SELECT COUNT(*) FROM test_connection');
      console.log('✅ Query successful - Total test records:', result.rows[0].count);
      
      await pool.query('DROP TABLE test_connection');
      console.log('✅ Table cleanup successful');
      
      console.log('\n🎉 All database tests passed!');
    } catch (testErr) {
      console.error('❌ Table operation failed:', testErr.message);
    }
    
    pool.end();
  }
});
