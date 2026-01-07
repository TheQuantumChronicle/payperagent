import { Router } from 'express';
import { getCoinGeckoMarkets, getCoinGeckoPrice } from '../../services/coingecko';
import { createX402Middleware } from '../../middleware/x402';
import { API_PRICING } from '../../config/pricing';

export const coingeckoRouter = Router();

let paywallMiddleware: any;

(async () => {
  const middleware = await createX402Middleware({
    maxAmountRequired: API_PRICING.coingecko.amount,
    description: API_PRICING.coingecko.description,
  });
  paywallMiddleware = middleware;
})();

coingeckoRouter.get('/', async (req, res, next) => {
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
        const { vs_currency, ids, per_page, page } = req.query;

        const data = await getCoinGeckoMarkets({
          vs_currency: vs_currency as string,
          ids: ids as string,
          per_page: per_page ? parseInt(per_page as string) : undefined,
          page: page ? parseInt(page as string) : undefined,
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

coingeckoRouter.get('/price/:coinId', async (req, res, next) => {
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
        const { coinId } = req.params;
        const { vs_currency } = req.query;

        const data = await getCoinGeckoPrice(coinId, vs_currency as string);

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
