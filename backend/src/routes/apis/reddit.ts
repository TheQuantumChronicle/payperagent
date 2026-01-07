import { Router } from 'express';
import { getRedditPosts } from '../../services/reddit';
import { createX402Middleware } from '../../middleware/x402';
import { API_PRICING } from '../../config/pricing';

export const redditRouter = Router();

let paywallMiddleware: any;

(async () => {
  const middleware = await createX402Middleware({
    maxAmountRequired: API_PRICING.reddit.amount,
    description: API_PRICING.reddit.description,
  });
  paywallMiddleware = middleware;
})();

redditRouter.get('/', async (req, res, next) => {
  try {
    if (!paywallMiddleware) {
      return res.status(503).json({
        success: false,
        error: 'Payment middleware initializing, please try again in a moment',
      });
    }

    return paywallMiddleware(req, res, async (err: any) => {
      if (err) return next(err);

      try {
        const { subreddit, sort, time, limit } = req.query;

        if (!subreddit) {
          return res.status(400).json({
            success: false,
            error: 'Subreddit parameter is required',
            example: '/api/reddit?subreddit=programming&sort=hot&limit=10',
          });
        }

        const data = await getRedditPosts({
          subreddit: subreddit as string,
          sort: sort as any,
          time: time as any,
          limit: limit ? parseInt(limit as string) : undefined,
        });

        res.setHeader('x-cache-hit', 'true');
        res.json(data);
      } catch (error: any) {
        res.status(500).json({
          success: false,
          error: error.message,
        });
      }
    });
  } catch (error) {
    next(error);
  }
});
