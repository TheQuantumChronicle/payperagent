import { Router } from 'express';
import { checkDatabaseConnection } from '../database/init';

export const healthRouter = Router();

healthRouter.get('/', async (_req, res) => {
  const uptime = process.uptime();
  const memoryUsage = process.memoryUsage();
  const dbConnected = await checkDatabaseConnection();
  
  const health = {
    status: 'healthy',
    service: 'PayPerAgent API Gateway',
    version: '0.1.0',
    timestamp: new Date().toISOString(),
    uptime: {
      seconds: Math.floor(uptime),
      formatted: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${Math.floor(uptime % 60)}s`,
    },
    memory: {
      heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
      rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
      external: `${Math.round(memoryUsage.external / 1024 / 1024)}MB`,
    },
    database: {
      connected: dbConnected,
      type: dbConnected ? 'PostgreSQL' : 'In-Memory',
    },
    network: {
      blockchain: 'SKALE Network',
      chain: 'Nebula Testnet',
      chainId: 37084624,
      gasFees: 'ZERO',
    },
  };
  
  res.json(health);
});
