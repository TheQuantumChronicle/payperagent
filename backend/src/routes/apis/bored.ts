import { Router } from 'express';
import { getRandomActivity, getActivityByType, getActivityByParticipants } from '../../services/bored';
import { createX402Middleware } from '../../middleware/x402';
import { API_PRICING } from '../../config/pricing';

export const boredRouter = Router();

let paywallMiddleware: any;

(async () => {
  paywallMiddleware = await createX402Middleware({
    maxAmountRequired: API_PRICING.bored.amount,
    description: API_PRICING.bored.description,
  });
})();

// Random activity
boredRouter.get('/activity', async (req, res, next) => {
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
        const { type, participants } = req.query;
        
        if (type && typeof type === 'string') {
          const result = await getActivityByType(type);
          return res.json(result);
        }
        
        if (participants) {
          const count = parseInt(participants as string);
          if (isNaN(count)) {
            return res.status(400).json({ success: false, error: 'Invalid participants count' });
          }
          const result = await getActivityByParticipants(count);
          return res.json(result);
        }
        
        const result = await getRandomActivity();
        return res.json(result);
      } catch (error) {
        return next(error);
      }
    });
  } catch (error) {
    return next(error);
  }
});
