import { Router } from 'express';
import { getCryptoPrice } from '../../services/crypto';
import { createX402Middleware } from '../../middleware/x402';
import { API_PRICING } from '../../config/pricing';
import { validateCryptoParams } from '../../middleware/validation';

export const cryptoRouter = Router();

let paywallMiddleware: any;

(async () => {
  const middleware = await createX402Middleware({
    maxAmountRequired: API_PRICING.crypto.amount,
    description: API_PRICING.crypto.description,
  });
  paywallMiddleware = middleware;
})();

cryptoRouter.get('/', validateCryptoParams, async (req, res, next) => {
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
        const { symbol, symbols } = req.query;

        if (!symbol && !symbols) {
          return res.status(400).json({
            success: false,
            error: 'Please provide symbol (e.g., BTCUSDT) or symbols (comma-separated like BTCUSDT,ETHUSDT)',
            examples: {
              single: '/api/crypto?symbol=BTCUSDT',
              multiple: '/api/crypto?symbols=BTCUSDT,ETHUSDT,BNBUSDT',
            },
          });
        }

        const cryptoData = await getCryptoPrice({
          symbol: symbol as string,
          symbols: symbols as string,
        });

        return res.json({
          success: true,
          data: cryptoData,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        return next(error);
      }
    });
  } catch (error) {
    return next(error);
  }
});
