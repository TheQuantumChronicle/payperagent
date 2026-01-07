import { Router } from 'express';
import { getTrendingTopics, getSentimentAnalysis, getAgentStats, getAIConversations } from '../../services/chirper';
import { createX402Middleware } from '../../middleware/x402';
import { API_PRICING } from '../../config/pricing';

export const chirperRouter = Router();

let trendingMiddleware: any;
let sentimentMiddleware: any;
let statsMiddleware: any;
let conversationsMiddleware: any;

(async () => {
  trendingMiddleware = await createX402Middleware({
    maxAmountRequired: API_PRICING.chirper_trending.amount,
    description: API_PRICING.chirper_trending.description,
  });

  sentimentMiddleware = await createX402Middleware({
    maxAmountRequired: API_PRICING.chirper_sentiment.amount,
    description: API_PRICING.chirper_sentiment.description,
  });

  statsMiddleware = await createX402Middleware({
    maxAmountRequired: API_PRICING.chirper_stats.amount,
    description: API_PRICING.chirper_stats.description,
  });

  conversationsMiddleware = await createX402Middleware({
    maxAmountRequired: API_PRICING.chirper_conversations.amount,
    description: API_PRICING.chirper_conversations.description,
  });
})();

// Get trending topics from AI agents
chirperRouter.get('/trending', async (req, res, next) => {
  if (!trendingMiddleware) {
    return res.status(503).json({ success: false, error: 'Payment middleware initializing' });
  }
  return trendingMiddleware(req, res, async (err: any) => {
    if (err) return next(err);
    try {
      const { limit, timeframe } = req.query;
      
      const data = await getTrendingTopics({
        limit: limit ? parseInt(limit as string) : 10,
        timeframe: (timeframe as '1h' | '24h' | '7d') || '24h'
      });
      
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
});

// Get sentiment analysis for a topic
chirperRouter.get('/sentiment', async (req, res, next) => {
  if (!sentimentMiddleware) {
    return res.status(503).json({ success: false, error: 'Payment middleware initializing' });
  }
  return sentimentMiddleware(req, res, async (err: any) => {
    if (err) return next(err);
    try {
      const { topic, timeframe } = req.query;
      
      if (!topic) {
        return res.status(400).json({
          success: false,
          error: 'Topic parameter required',
          example: '/api/chirper/sentiment?topic=SKALE&timeframe=24h'
        });
      }

      const data = await getSentimentAnalysis({
        topic: topic as string,
        timeframe: (timeframe as '1h' | '24h' | '7d') || '24h'
      });
      
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
});

// Get AI agent or network stats
chirperRouter.get('/stats', async (req, res, next) => {
  if (!statsMiddleware) {
    return res.status(503).json({ success: false, error: 'Payment middleware initializing' });
  }
  return statsMiddleware(req, res, async (err: any) => {
    if (err) return next(err);
    try {
      const { agentId } = req.query;
      const data = await getAgentStats({ agentId: agentId as string });
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
});

// Get AI conversations about a topic
chirperRouter.get('/conversations', async (req, res, next) => {
  if (!conversationsMiddleware) {
    return res.status(503).json({ success: false, error: 'Payment middleware initializing' });
  }
  return conversationsMiddleware(req, res, async (err: any) => {
    if (err) return next(err);
    try {
      const { topic, limit } = req.query;
      
      if (!topic) {
        return res.status(400).json({
          success: false,
          error: 'Topic parameter required',
          example: '/api/chirper/conversations?topic=DeFi&limit=5'
        });
      }

      const data = await getAIConversations(
        topic as string,
        limit ? parseInt(limit as string) : 5
      );
      
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
});
