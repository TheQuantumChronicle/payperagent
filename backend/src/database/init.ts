import { readFileSync } from 'fs';
import { join } from 'path';
import pool from '../config/database';

export async function initializeDatabase(): Promise<void> {
  try {
    console.log('🔧 Initializing database...');

    // Check if we have a database connection
    const hasConnection = await checkDatabaseConnection();
    if (!hasConnection) {
      console.log('⚠️  No database connection - using in-memory storage');
      return;
    }

    // Read and execute schema
    const schemaPath = join(__dirname, 'schema.sql');
    const schema = readFileSync(schemaPath, 'utf-8');
    
    await pool.query(schema);
    
    console.log('✅ Database schema initialized successfully');
    
    // Log connection info
    if (process.env.DATABASE_URL) {
      console.log('📡 Connected to PostgreSQL via DATABASE_URL');
    } else {
      console.log(`📡 Connected to PostgreSQL at ${process.env.DB_HOST}:${process.env.DB_PORT}`);
    }
  } catch (error: any) {
    console.error('❌ Database initialization failed:', error.message);
    console.log('⚠️  Continuing without database - using in-memory storage');
  }
}

export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await pool.query('SELECT NOW()');
    console.log('✅ Database connection test successful');
    return true;
  } catch (error: any) {
    console.error('❌ Database connection test failed:', error.message);
    return false;
  }
}
