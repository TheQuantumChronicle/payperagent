import { Router } from 'express';
import { searchUniversities } from '../../services/universities';
import { createX402Middleware } from '../../middleware/x402';
import { API_PRICING } from '../../config/pricing';

export const universitiesRouter = Router();

let paywallMiddleware: any;

(async () => {
  paywallMiddleware = await createX402Middleware({
    maxAmountRequired: API_PRICING.universities.amount,
    description: API_PRICING.universities.description,
  });
})();

universitiesRouter.get('/search', async (req, res, next) => {
  try {
    if (!paywallMiddleware) {
      return res.status(503).json({
        success: false,
        error: 'Payment middleware initializing, please try again',
      });
    }

    return paywallMiddleware(req, res, async (err: any) => {
      if (err) return next(err);
      try {
        const { country, name } = req.query;
        const result = await searchUniversities(
          country as string,
          name as string
        );
        return res.json(result);
      } catch (error) {
        return next(error);
      }
    });
  } catch (error) {
    return next(error);
  }
});
