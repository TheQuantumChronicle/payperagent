import { Router } from 'express';
import { dbAnalytics } from '../services/dbAnalytics';

export const analyticsRouter = Router();

analyticsRouter.get('/usage', async (_req, res) => {
  try {
    const stats = await dbAnalytics.getStats(24); // Last 24 hours
    
    const overview = stats.overview;
    const successRate = overview.total_requests > 0 
      ? ((overview.successful_requests / overview.total_requests) * 100).toFixed(2)
      : '0.00';

    res.json({
      overview: {
        totalRequests: parseInt(overview.total_requests) || 0,
        successfulRequests: parseInt(overview.successful_requests) || 0,
        failedRequests: parseInt(overview.failed_requests) || 0,
        successRate: `${successRate}%`,
        averageResponseTime: `${overview.avg_response_time || 0}ms`,
        totalRevenue: `${parseFloat(overview.total_revenue || 0).toFixed(6)} USDC`,
        uniqueAgents: parseInt(overview.unique_agents) || 0,
        cachedRequests: parseInt(overview.cached_requests) || 0,
      },
      endpoints: stats.endpoints.map((ep: any) => ({
        endpoint: ep.endpoint,
        requests: parseInt(ep.requests),
        averageResponseTime: `${ep.avg_time}ms`,
        revenue: `${parseFloat(ep.revenue || 0).toFixed(6)} USDC`,
      })),
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});
