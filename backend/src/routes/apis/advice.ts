import { Router } from 'express';
import { getRandomAdvice, searchAdvice } from '../../services/advice';
import { createX402Middleware } from '../../middleware/x402';
import { API_PRICING } from '../../config/pricing';

export const adviceRouter = Router();

let randomMiddleware: any;
let searchMiddleware: any;

(async () => {
  randomMiddleware = await createX402Middleware({
    maxAmountRequired: API_PRICING.advice_random.amount,
    description: API_PRICING.advice_random.description,
  });
  
  searchMiddleware = await createX402Middleware({
    maxAmountRequired: API_PRICING.advice_search.amount,
    description: API_PRICING.advice_search.description,
  });
})();

adviceRouter.get('/random', async (req, res, next) => {
  try {
    if (!randomMiddleware) {
      return res.status(503).json({
        success: false,
        error: 'Payment middleware initializing, please try again',
      });
    }

    return randomMiddleware(req, res, async (err: any) => {
      if (err) return next(err);
      try {
        const result = await getRandomAdvice();
        return res.json(result);
      } catch (error) {
        return next(error);
      }
    });
  } catch (error) {
    return next(error);
  }
});

adviceRouter.get('/search', async (req, res, next) => {
  try {
    if (!searchMiddleware) {
      return res.status(503).json({
        success: false,
        error: 'Payment middleware initializing, please try again',
      });
    }

    return searchMiddleware(req, res, async (err: any) => {
      if (err) return next(err);
      try {
        const { q } = req.query;
        if (!q || typeof q !== 'string') {
          return res.status(400).json({ success: false, error: 'Query parameter "q" is required' });
        }
        const result = await searchAdvice(q);
        return res.json(result);
      } catch (error) {
        return next(error);
      }
    });
  } catch (error) {
    return next(error);
  }
});
