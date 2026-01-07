import { Router } from 'express';
import { queryXAI } from '../../services/xai';
import { createX402Middleware } from '../../middleware/x402';
import { API_PRICING } from '../../config/pricing';

export const xaiRouter = Router();

let paywallMiddleware: any;

(async () => {
  const middleware = await createX402Middleware({
    maxAmountRequired: API_PRICING.xai.amount,
    description: API_PRICING.xai.description,
  });
  paywallMiddleware = middleware;
})();

xaiRouter.post('/', async (req, res, next) => {
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
        const { prompt, model, max_tokens, temperature } = req.body;

        if (!prompt) {
          return res.status(400).json({
            success: false,
            error: 'Prompt is required in request body',
            example: { prompt: 'Explain quantum computing', model: 'grok-beta' },
          });
        }

        const data = await queryXAI({
          prompt,
          model,
          max_tokens,
          temperature,
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
