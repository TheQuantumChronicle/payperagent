import cron from 'node-cron';
import { cryptoCache, weatherCache, newsCache } from '../services/dbCache';
import { dbAnalytics } from '../services/dbAnalytics';
import { query } from '../config/database';

export function startCleanupJobs(): void {
  console.log('🔧 Starting automated cleanup jobs...');

  // Clean expired cache entries every 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    try {
      const [cryptoCleaned, weatherCleaned, newsCleaned] = await Promise.all([
        cryptoCache.cleanup(),
        weatherCache.cleanup(),
        newsCache.cleanup(),
      ]);
      
      const total = cryptoCleaned + weatherCleaned + newsCleaned;
      if (total > 0) {
        console.log(`🧹 Cache cleanup: removed ${total} expired entries`);
      }
    } catch (error: any) {
      console.warn('⚠️  Cache cleanup failed:', error.message);
    }
  });

  // Clean old analytics data daily at 2 AM
  cron.schedule('0 2 * * *', async () => {
    try {
      const deleted = await dbAnalytics.cleanup(30); // Keep 30 days
      console.log(`🧹 Daily cleanup: removed ${deleted} old analytics records`);
    } catch (error: any) {
      console.warn('⚠️  Analytics cleanup failed:', error.message);
    }
  });

  // Database maintenance weekly on Sunday at 3 AM
  cron.schedule('0 3 * * 0', async () => {
    try {
      console.log('🔧 Running weekly database maintenance...');
      
      // Run cleanup function
      await query('SELECT cleanup_old_data()');
      
      // Vacuum and analyze for performance
      await query('VACUUM ANALYZE');
      
      console.log('✅ Weekly database maintenance completed');
    } catch (error: any) {
      console.warn('⚠️  Database maintenance failed:', error.message);
    }
  });

  // Memory monitoring every hour
  cron.schedule('0 * * * *', () => {
    const used = process.memoryUsage();
    const memoryMB = {
      rss: Math.round(used.rss / 1024 / 1024),
      heapTotal: Math.round(used.heapTotal / 1024 / 1024),
      heapUsed: Math.round(used.heapUsed / 1024 / 1024),
      external: Math.round(used.external / 1024 / 1024),
    };
    
    const heapUsagePercent = (memoryMB.heapUsed / memoryMB.heapTotal) * 100;
    
    console.log(`📊 Memory: ${memoryMB.heapUsed}MB/${memoryMB.heapTotal}MB (${heapUsagePercent.toFixed(1)}%)`);
    
    // Force garbage collection if heap usage is high (>80%)
    if (heapUsagePercent > 80) {
      console.log('⚠️  High memory usage, triggering garbage collection');
      if (global.gc) {
        global.gc();
        console.log('✅ Garbage collection completed');
      } else {
        console.log('⚠️  Garbage collection not available (run with --expose-gc)');
      }
    }
  });

  console.log('✅ Cleanup jobs started:');
  console.log('   - Cache cleanup: every 5 minutes');
  console.log('   - Analytics cleanup: daily at 2 AM');
  console.log('   - Database maintenance: weekly on Sunday at 3 AM');
  console.log('   - Memory monitoring: hourly');
}
