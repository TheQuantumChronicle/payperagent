import { Router } from 'express';
import { getRandomJoke, getJokesByType, searchJokes } from '../../services/jokes';
import { createX402Middleware } from '../../middleware/x402';
import { API_PRICING } from '../../config/pricing';

export const jokesRouter = Router();

let randomMiddleware: any;
let typeMiddleware: any;
let searchMiddleware: any;

(async () => {
  randomMiddleware = await createX402Middleware({
    maxAmountRequired: API_PRICING.jokes_random.amount,
    description: API_PRICING.jokes_random.description,
  });
  
  typeMiddleware = await createX402Middleware({
    maxAmountRequired: API_PRICING.jokes_type.amount,
    description: API_PRICING.jokes_type.description,
  });
  
  searchMiddleware = await createX402Middleware({
    maxAmountRequired: API_PRICING.jokes_search.amount,
    description: API_PRICING.jokes_search.description,
  });
})();

// Random joke
jokesRouter.get('/random', async (req, res, next) => {
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
        const result = await getRandomJoke();
        return res.json(result);
      } catch (error) {
        return next(error);
      }
    });
  } catch (error) {
    return next(error);
  }
});

// Jokes by type
jokesRouter.get('/type/:type', async (req, res, next) => {
  try {
    if (!typeMiddleware) {
      return res.status(503).json({
        success: false,
        error: 'Payment middleware initializing, please try again',
      });
    }

    return typeMiddleware(req, res, async (err: any) => {
      if (err) return next(err);
      try {
        const { type } = req.params;
        const result = await getJokesByType(type);
        return res.json(result);
      } catch (error) {
        return next(error);
      }
    });
  } catch (error) {
    return next(error);
  }
});

// Search jokes
jokesRouter.get('/search', async (req, res, next) => {
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
        const result = await searchJokes(q);
        return res.json(result);
      } catch (error) {
        return next(error);
      }
    });
  } catch (error) {
    return next(error);
  }
});
