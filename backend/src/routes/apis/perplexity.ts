import { Router } from 'express';
import { searchPerplexity } from '../../services/perplexity';
import { createX402Middleware } from '../../middleware/x402';
import { API_PRICING } from '../../config/pricing';

export const perplexityRouter = Router();

let paywallMiddleware: any;

(async () => {
  const middleware = await createX402Middleware({
    maxAmountRequired: API_PRICING.perplexity.amount,
    description: API_PRICING.perplexity.description,
  });
  paywallMiddleware = middleware;
})();

perplexityRouter.post('/', async (req, res, next) => {
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
        const { query, model, max_tokens } = req.body;

        if (!query) {
          return res.status(400).json({
            success: false,
            error: 'Query is required in request body',
            example: { query: 'What is SKALE Network?', model: 'llama-3.1-sonar-small-128k-online' },
          });
        }

        const data = await searchPerplexity({
          query,
          model,
          max_tokens,
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
