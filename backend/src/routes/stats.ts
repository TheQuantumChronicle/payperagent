import { Router } from 'express';
import { dbAnalytics } from '../services/dbAnalytics';

export const statsRouter = Router();

statsRouter.get('/', async (_req, res) => {
  try {
    const stats = await dbAnalytics.getStats(24); // Last 24 hours
    
    const overview = stats.overview;
    const endpoints = stats.endpoints || [];
    
    const response = {
      overview: {
        totalRequests: parseInt(overview.total_requests) || 0,
        successfulRequests: parseInt(overview.successful_requests) || 0,
        failedRequests: parseInt(overview.failed_requests) || 0,
        averageResponseTime: `${overview.avg_response_time || 0}ms`,
        totalRevenue: `${parseFloat(overview.total_revenue || 0).toFixed(6)} USDC`,
        uniqueAgents: parseInt(overview.unique_agents) || 0,
      },
      endpoints: endpoints.map((ep: any) => ({
        endpoint: ep.endpoint,
        requests: parseInt(ep.requests),
        avgResponseTime: `${ep.avg_time}ms`,
        revenue: `${parseFloat(ep.revenue || 0).toFixed(6)} USDC`,
      })),
      performance: {
        fastestEndpoint: endpoints.length > 0
          ? endpoints.reduce((min: any, e: any) => e.avg_time < min.avg_time ? e : min).endpoint
          : 'N/A',
        mostUsedEndpoint: endpoints.length > 0
          ? endpoints.reduce((max: any, e: any) => e.requests > max.requests ? e : max).endpoint
          : 'N/A',
      },
      systemInfo: {
        uptime: `${Math.floor(process.uptime())}s`,
        memoryUsage: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
        nodeVersion: process.version,
      },
    };

    res.json(response);
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});
