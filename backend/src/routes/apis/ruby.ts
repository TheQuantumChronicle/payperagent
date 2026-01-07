import { Router } from 'express';
import { getTokenPrice, getPoolLiquidity, getSwapQuote, getTopPairs } from '../../services/ruby';
import { createX402Middleware } from '../../middleware/x402';
import { API_PRICING } from '../../config/pricing';

export const rubyRouter = Router();

let priceMiddleware: any;
let liquidityMiddleware: any;
let quoteMiddleware: any;
let pairsMiddleware: any;

(async () => {
  priceMiddleware = await createX402Middleware({
    maxAmountRequired: API_PRICING.ruby_price.amount,
    description: API_PRICING.ruby_price.description,
  });

  liquidityMiddleware = await createX402Middleware({
    maxAmountRequired: API_PRICING.ruby_liquidity.amount,
    description: API_PRICING.ruby_liquidity.description,
  });

  quoteMiddleware = await createX402Middleware({
    maxAmountRequired: API_PRICING.ruby_quote.amount,
    description: API_PRICING.ruby_quote.description,
  });

  pairsMiddleware = await createX402Middleware({
    maxAmountRequired: API_PRICING.ruby_pairs.amount,
    description: API_PRICING.ruby_pairs.description,
  });
})();

// Get token price on Ruby.Exchange
rubyRouter.get('/price', async (req, res, next) => {
  if (!priceMiddleware) {
    return res.status(503).json({ success: false, error: 'Payment middleware initializing' });
  }
  return priceMiddleware(req, res, async (err: any) => {
    if (err) return next(err);
    try {
      const { token, pair } = req.query;
      
      if (!token) {
        return res.status(400).json({
          success: false,
          error: 'Token parameter required',
          example: '/api/ruby/price?token=SKILL&pair=USDC'
        });
      }

      const data = await getTokenPrice({
        token: token as string,
        pair: pair as string
      });
      
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
});

// Get pool liquidity
rubyRouter.get('/liquidity', async (req, res, next) => {
  if (!liquidityMiddleware) {
    return res.status(503).json({ success: false, error: 'Payment middleware initializing' });
  }
  return liquidityMiddleware(req, res, async (err: any) => {
    if (err) return next(err);
    try {
      const { pool } = req.query;
      
      if (!pool) {
        return res.status(400).json({
          success: false,
          error: 'Pool parameter required',
          example: '/api/ruby/liquidity?pool=SKL-USDC'
        });
      }

      const data = await getPoolLiquidity({ pool: pool as string });
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
});

// Get swap quote
rubyRouter.get('/quote', async (req, res, next) => {
  if (!quoteMiddleware) {
    return res.status(503).json({ success: false, error: 'Payment middleware initializing' });
  }
  return quoteMiddleware(req, res, async (err: any) => {
    if (err) return next(err);
    try {
      const { fromToken, toToken, amount } = req.query;
      
      if (!fromToken || !toToken || !amount) {
        return res.status(400).json({
          success: false,
          error: 'Parameters required: fromToken, toToken, amount',
          example: '/api/ruby/quote?fromToken=SKL&toToken=USDC&amount=100'
        });
      }

      const data = await getSwapQuote({
        fromToken: fromToken as string,
        toToken: toToken as string,
        amount: amount as string
      });
      
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
});

// Get top trading pairs
rubyRouter.get('/pairs', async (req, res, next) => {
  if (!pairsMiddleware) {
    return res.status(503).json({ success: false, error: 'Payment middleware initializing' });
  }
  return pairsMiddleware(req, res, async (err: any) => {
    if (err) return next(err);
    try {
      const { limit } = req.query;
      const data = await getTopPairs(limit ? parseInt(limit as string) : 10);
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
});
