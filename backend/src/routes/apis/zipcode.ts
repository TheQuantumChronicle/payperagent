import { Router } from 'express';
import { getZipCodeInfo } from '../../services/zipcode';
import { createX402Middleware } from '../../middleware/x402';
import { API_PRICING } from '../../config/pricing';

export const zipcodeRouter = Router();

let paywallMiddleware: any;

(async () => {
  paywallMiddleware = await createX402Middleware({
    maxAmountRequired: API_PRICING.zipcode.amount,
    description: API_PRICING.zipcode.description,
  });
})();

zipcodeRouter.get('/:country/:zipcode', async (req, res, next) => {
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
        const { country, zipcode } = req.params;
        const result = await getZipCodeInfo(country, zipcode);
        return res.json(result);
      } catch (error) {
        return next(error);
      }
    });
  } catch (error) {
    return next(error);
  }
});
