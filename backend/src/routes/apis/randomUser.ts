import { Router } from 'express';
import { getRandomUsers } from '../../services/randomUser';
import { createX402Middleware } from '../../middleware/x402';
import { API_PRICING } from '../../config/pricing';

export const randomUserRouter = Router();

let paywallMiddleware: any;

(async () => {
  paywallMiddleware = await createX402Middleware({
    maxAmountRequired: API_PRICING.randomuser.amount,
    description: API_PRICING.randomuser.description,
  });
})();

randomUserRouter.get('/', async (req, res, next) => {
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
        const count = parseInt(req.query.count as string) || 1;
        const nationality = req.query.nat as string;
        const result = await getRandomUsers(count, nationality);
        return res.json(result);
      } catch (error) {
        return next(error);
      }
    });
  } catch (error) {
    return next(error);
  }
});
