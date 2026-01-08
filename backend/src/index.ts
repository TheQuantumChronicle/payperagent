import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import path from 'path';
import { createServer } from 'http';
import { healthRouter } from './routes/health';
import { gatewayRouter } from './routes/gateway';
import { analyticsRouter } from './routes/analytics';
import { statsRouter } from './routes/stats';
import { cacheRouter } from './routes/cache';
import { systemRouter } from './routes/system';
import { docsRouter } from './routes/docs';
import { errorHandler } from './middleware/errorHandler';
import { apiLimiter, createAgentLimiter } from './middleware/rateLimit';
import { analyticsMiddleware } from './middleware/analytics';
import { rateLimitHeaders } from './middleware/responseEnhancer';
import { requestLogger } from './middleware/requestLogger';
import { corsOptions } from './middleware/cors';
import { createAgentKitMiddleware } from './integrations/agentkit';
import { initializeDatabase, checkDatabaseConnection } from './database/init';
import { startCleanupJobs } from './jobs/cleanup';
import { RealtimeServer } from './websocket/server';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy for Railway deployment
app.set('trust proxy', true);

app.use(helmet({
  contentSecurityPolicy: false, // Allow frontend assets
  crossOriginEmbedderPolicy: false,
}));
app.use(cors(corsOptions));
app.use(compression());
app.use(express.json());
app.use(requestLogger);
app.use(rateLimitHeaders);
app.use(analyticsMiddleware);

// AgentKit compatibility middleware
app.use(createAgentKitMiddleware({
  walletAddress: process.env.FACILITATOR_ADDRESS || '',
  network: 'skale',
}));

// API routes (must come before static files)
app.use('/health', healthRouter);
app.use('/api', apiLimiter, createAgentLimiter(), gatewayRouter);
app.use('/analytics', analyticsRouter);
app.use('/stats', statsRouter);
app.use('/cache', cacheRouter);
app.use('/system', systemRouter);
app.use('/docs', docsRouter);

// Serve frontend static files
const frontendPath = path.join(__dirname, '../../frontend/dist');
app.use(express.static(frontendPath));

// SPA fallback - serve index.html for all non-API routes
app.get('*', (req, res) => {
  // Don't serve index.html for API routes
  if (req.path.startsWith('/api') || 
      req.path.startsWith('/health') || 
      req.path.startsWith('/stats') ||
      req.path.startsWith('/analytics') ||
      req.path.startsWith('/cache') ||
      req.path.startsWith('/system') ||
      req.path.startsWith('/docs')) {
    return res.status(404).json({ error: 'Not found' });
  }
  return res.sendFile(path.join(frontendPath, 'index.html'));
});

app.use(errorHandler);

// Create HTTP server for WebSocket support
const server = createServer(app);

// Initialize WebSocket server
const wsServer = new RealtimeServer(server);

server.listen(PORT, async () => {
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
  PrettyLogger.info('GET  /health                      Health check');
  PrettyLogger.info('GET  /api                         Gateway information');
  PrettyLogger.info('GET  /api/weather                 Weather data (0.001 USDC)');
  PrettyLogger.info('GET  /api/crypto                  Crypto prices (0.002 USDC)');
  PrettyLogger.info('GET  /api/news                    News articles (0.005 USDC)');
  PrettyLogger.info('GET  /api/perplexity              AI search (0.010 USDC)');
  PrettyLogger.info('GET  /api/xai                     Grok AI (0.008 USDC)');
  PrettyLogger.info('GET  /analytics/usage             Usage statistics');
  PrettyLogger.info('GET  /cache/stats                 Cache statistics');
  PrettyLogger.info('GET  /system/circuit-breakers     Circuit breaker status');
  PrettyLogger.info('GET  /system/metrics              System metrics');
  PrettyLogger.info('GET  /docs                        API Documentation');
  PrettyLogger.info('WS   /ws                          WebSocket connection');
  
  PrettyLogger.section('Status');
  if (dbConnected) {
    PrettyLogger.success('Database: PostgreSQL Connected');
  } else {
    PrettyLogger.warning('Database: Using in-memory storage');
  }
  PrettyLogger.success('Cleanup Jobs: Active (4 scheduled)');
  PrettyLogger.success('Rate Limiting: Enabled');
  PrettyLogger.success('Circuit Breakers: Active (8 services)');
  PrettyLogger.success('Request Logging: Enabled');
  PrettyLogger.success('Error Handling: Enhanced');
  PrettyLogger.success('WebSocket Server: Active');
  PrettyLogger.success('API Documentation: /docs');
  PrettyLogger.success(`Server: http://localhost:${PORT}`);
  PrettyLogger.success(`WebSocket: ws://localhost:${PORT}/ws`);
  
  console.log('');
});

export default app;
export { wsServer };
