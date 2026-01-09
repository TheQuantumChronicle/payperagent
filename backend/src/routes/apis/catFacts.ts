import { Router } from 'express';
import { getRandomCatFact, getMultipleCatFacts } from '../../services/catFacts';
import { createX402Middleware } from '../../middleware/x402';
import { API_PRICING } from '../../config/pricing';

export const catFactsRouter = Router();

let randomMiddleware: any;
let multipleMiddleware: any;

(async () => {
  randomMiddleware = await createX402Middleware({
    maxAmountRequired: API_PRICING.catfact_random.amount,
    description: API_PRICING.catfact_random.description,
  });
  
  multipleMiddleware = await createX402Middleware({
    maxAmountRequired: API_PRICING.catfact_multiple.amount,
    description: API_PRICING.catfact_multiple.description,
  });
})();

catFactsRouter.get('/random', async (req, res, next) => {
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
        const result = await getRandomCatFact();
        return res.json(result);
      } catch (error) {
        return next(error);
      }
    });
  } catch (error) {
    return next(error);
  }
});

catFactsRouter.get('/facts', async (req, res, next) => {
  try {
    if (!multipleMiddleware) {
      return res.status(503).json({
        success: false,
        error: 'Payment middleware initializing, please try again',
      });
    }

    return multipleMiddleware(req, res, async (err: any) => {
      if (err) return next(err);
      try {
        const limit = parseInt(req.query.limit as string) || 5;
        const result = await getMultipleCatFacts(limit);
        return res.json(result);
      } catch (error) {
        return next(error);
      }
    });
  } catch (error) {
    return next(error);
  }
});
