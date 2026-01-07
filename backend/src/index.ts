import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import { healthRouter } from './routes/health';
import { gatewayRouter } from './routes/gateway';
import { analyticsRouter } from './routes/analytics';
import { statsRouter } from './routes/stats';
import { cacheRouter } from './routes/cache';
import { errorHandler } from './middleware/errorHandler';
import { apiLimiter, createAgentLimiter } from './middleware/rateLimit';
import { analyticsMiddleware } from './middleware/analytics';
import { rateLimitHeaders } from './middleware/responseEnhancer';
import { initializeDatabase, checkDatabaseConnection } from './database/init';
import { startCleanupJobs } from './jobs/cleanup';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(compression()); // Compress all responses
app.use(express.json());
app.use(rateLimitHeaders);
app.use(analyticsMiddleware);

app.use('/health', healthRouter);
app.use('/api', apiLimiter, createAgentLimiter(), gatewayRouter);
app.use('/analytics', analyticsRouter);
app.use('/stats', statsRouter);
app.use('/cache', cacheRouter);

app.use(errorHandler);

app.listen(PORT, async () => {
  const { PrettyLogger } = await import('./utils/prettyLogger');
  
  // Initialize database
  await initializeDatabase();
  
  // Check database connection
  const dbConnected = await checkDatabaseConnection();
  
  // Start cleanup jobs
  startCleanupJobs();
  
  // Beautiful startup banner
  PrettyLogger.banner();
  
  PrettyLogger.section('System Information');
  PrettyLogger.metric('Version', '0.1.0');
  PrettyLogger.metric('Environment', process.env.NODE_ENV || 'development');
  PrettyLogger.metric('Port', PORT);
  PrettyLogger.metric('Node.js', process.version);
  
  PrettyLogger.section('Network Configuration');
  PrettyLogger.metric('Blockchain', 'SKALE Network');
  PrettyLogger.metric('Chain', 'Nebula Testnet');
  PrettyLogger.metric('Chain ID', '37084624');
  PrettyLogger.metric('Gas Fees', 'ZERO ⚡');
  
  PrettyLogger.section('API Endpoints');
  PrettyLogger.info('GET  /health              Health check');
  PrettyLogger.info('GET  /api                 Gateway information');
  PrettyLogger.info('GET  /api/weather         Weather data (0.001 USDC)');
  PrettyLogger.info('GET  /api/crypto          Crypto prices (0.002 USDC)');
  PrettyLogger.info('GET  /api/news            News articles (0.005 USDC)');
  PrettyLogger.info('GET  /analytics/usage     Usage statistics');
  PrettyLogger.info('GET  /cache/stats         Cache statistics');
  PrettyLogger.info('POST /cache/clear         Clear all caches');
  
  PrettyLogger.section('Status');
  if (dbConnected) {
    PrettyLogger.success('Database: PostgreSQL Connected');
  } else {
    PrettyLogger.warning('Database: Using in-memory storage');
  }
  PrettyLogger.success('Cleanup Jobs: Active (4 scheduled)');
  PrettyLogger.success('Rate Limiting: Enabled');
  PrettyLogger.success(`Server: http://localhost:${PORT}`);
  
  console.log('');
});

export default app;
