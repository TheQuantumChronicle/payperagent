import { Router } from 'express';
import { checkDatabaseConnection } from '../database/init';
import { circuitBreakers } from '../utils/circuitBreaker';

export const healthRouter = Router();

healthRouter.get('/', async (_req, res) => {
  const uptime = process.uptime();
  const memoryUsage = process.memoryUsage();
  const dbConnected = await checkDatabaseConnection();
  
  // Check circuit breaker states
  const circuitBreakerStatus = Object.entries(circuitBreakers).reduce((acc, [key, breaker]) => {
    const stats = breaker.getStats();
    acc[key] = stats.state;
    return acc;
  }, {} as Record<string, string>);
  
  const openCircuits = Object.values(circuitBreakerStatus).filter(state => state === 'OPEN').length;
  const allCircuitsClosed = openCircuits === 0;
  
  // Determine overall health status
  let status = 'healthy';
  const issues: string[] = [];
  
  if (!dbConnected) {
    issues.push('Database connection unavailable (using in-memory fallback)');
  }
  
  if (openCircuits > 0) {
    status = 'degraded';
    issues.push(`${openCircuits} external service(s) unavailable`);
  }
  
  if (memoryUsage.heapUsed / memoryUsage.heapTotal > 0.9) {
    status = 'degraded';
    issues.push('High memory usage');
  }
  
  const health = {
    status,
    service: 'PayPerAgent API Gateway',
    version: '1.0.0',
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
      usage: `${Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100)}%`,
    },
    database: {
      connected: dbConnected,
      type: dbConnected ? 'PostgreSQL' : 'In-Memory',
      status: dbConnected ? 'operational' : 'fallback',
    },
    externalServices: {
      status: allCircuitsClosed ? 'operational' : 'degraded',
      circuitBreakers: circuitBreakerStatus,
      openCircuits,
      totalCircuits: Object.keys(circuitBreakers).length,
    },
    network: {
      blockchain: 'SKALE Network',
      chain: 'Nebula Testnet',
      chainId: 37084624,
      gasFees: 'ZERO',
    },
    environment: process.env.NODE_ENV || 'development',
    ...(issues.length > 0 && { issues }),
  };
  
  const statusCode = status === 'healthy' ? 200 : 200;
  return res.status(statusCode).json(health);
});
