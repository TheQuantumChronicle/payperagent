import { Router } from 'express';
import { searchWikipedia, getWikipediaPage } from '../../services/wikipedia';
import { createX402Middleware } from '../../middleware/x402';
import { API_PRICING } from '../../config/pricing';

export const wikipediaRouter = Router();

let paywallMiddleware: any;

(async () => {
  const middleware = await createX402Middleware({
    maxAmountRequired: API_PRICING.wikipedia.amount,
    description: API_PRICING.wikipedia.description,
  });
  paywallMiddleware = middleware;
})();

wikipediaRouter.get('/search', async (req, res, next) => {
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
        const { query, limit } = req.query;

        if (!query) {
          return res.status(400).json({
            success: false,
            error: 'Query parameter is required',
          });
        }

        const data = await searchWikipedia({
          query: query as string,
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

wikipediaRouter.get('/page', async (req, res, next) => {
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
        const { title } = req.query;

        if (!title) {
          return res.status(400).json({
            success: false,
            error: 'Title parameter is required',
          });
        }

        const data = await getWikipediaPage({ title: title as string });

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
