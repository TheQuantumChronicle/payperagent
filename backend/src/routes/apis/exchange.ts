import { Router } from 'express';
import { getExchangeRates, convertCurrency } from '../../services/exchange';
import { createX402Middleware } from '../../middleware/x402';
import { API_PRICING } from '../../config/pricing';

export const exchangeRouter = Router();

let paywallMiddleware: any;

(async () => {
  const middleware = await createX402Middleware({
    maxAmountRequired: API_PRICING.exchange.amount,
    description: API_PRICING.exchange.description,
  });
  paywallMiddleware = middleware;
})();

exchangeRouter.get('/rates', async (req, res, next) => {
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
        const { base, symbols } = req.query;

        const data = await getExchangeRates({
          base: base as string,
          symbols: symbols ? (symbols as string).split(',') : undefined,
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

exchangeRouter.get('/convert', async (req, res, next) => {
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
        const { amount, from, to } = req.query;

        if (!amount || !from || !to) {
          return res.status(400).json({
            success: false,
            error: 'Parameters required: amount, from, to',
            example: '/api/exchange/convert?amount=100&from=USD&to=EUR',
          });
        }

        const data = await convertCurrency(
          parseFloat(amount as string),
          from as string,
          to as string
        );

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
