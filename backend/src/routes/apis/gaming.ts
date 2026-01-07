import { Router } from 'express';
import { getGameStats, getNFTPrices, getLeaderboard, getGameTokenPrice, getAllGamesOverview } from '../../services/gaming';
import { createX402Middleware } from '../../middleware/x402';
import { API_PRICING } from '../../config/pricing';

export const gamingRouter = Router();

let statsMiddleware: any;
let nftMiddleware: any;
let leaderboardMiddleware: any;
let tokenMiddleware: any;
let overviewMiddleware: any;

(async () => {
  statsMiddleware = await createX402Middleware({
    maxAmountRequired: API_PRICING.gaming_stats.amount,
    description: API_PRICING.gaming_stats.description,
  });

  nftMiddleware = await createX402Middleware({
    maxAmountRequired: API_PRICING.gaming_nft.amount,
    description: API_PRICING.gaming_nft.description,
  });

  leaderboardMiddleware = await createX402Middleware({
    maxAmountRequired: API_PRICING.gaming_leaderboard.amount,
    description: API_PRICING.gaming_leaderboard.description,
  });

  tokenMiddleware = await createX402Middleware({
    maxAmountRequired: API_PRICING.gaming_token.amount,
    description: API_PRICING.gaming_token.description,
  });

  overviewMiddleware = await createX402Middleware({
    maxAmountRequired: API_PRICING.gaming_overview.amount,
    description: API_PRICING.gaming_overview.description,
  });
})();

// Get game statistics
gamingRouter.get('/stats', async (req, res, next) => {
  if (!statsMiddleware) {
    return res.status(503).json({ success: false, error: 'Payment middleware initializing' });
  }
  return statsMiddleware(req, res, async (err: any) => {
    if (err) return next(err);
    try {
      const { game } = req.query;
      
      if (!game) {
        return res.status(400).json({
          success: false,
          error: 'Game parameter required',
          example: '/api/gaming/stats?game=cryptoblades',
          supportedGames: ['cryptoblades', 'bithotel', 'mystrios', 'motodex', '5tars']
        });
      }

      const data = await getGameStats({ game: game as string });
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
});

// Get NFT prices for a game
gamingRouter.get('/nft', async (req, res, next) => {
  if (!nftMiddleware) {
    return res.status(503).json({ success: false, error: 'Payment middleware initializing' });
  }
  return nftMiddleware(req, res, async (err: any) => {
    if (err) return next(err);
    try {
      const { game, collection } = req.query;
      
      if (!game) {
        return res.status(400).json({
          success: false,
          error: 'Game parameter required',
          example: '/api/gaming/nft?game=cryptoblades&collection=Weapons'
        });
      }

      const data = await getNFTPrices({
        game: game as string,
        collection: collection as string
      });
      
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
});

// Get game leaderboard
gamingRouter.get('/leaderboard', async (req, res, next) => {
  if (!leaderboardMiddleware) {
    return res.status(503).json({ success: false, error: 'Payment middleware initializing' });
  }
  return leaderboardMiddleware(req, res, async (err: any) => {
    if (err) return next(err);
    try {
      const { game, limit } = req.query;
      
      if (!game) {
        return res.status(400).json({
          success: false,
          error: 'Game parameter required',
          example: '/api/gaming/leaderboard?game=cryptoblades&limit=10'
        });
      }

      const data = await getLeaderboard({
        game: game as string,
        limit: limit ? parseInt(limit as string) : 10
      });
      
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
});

// Get game token price
gamingRouter.get('/token', async (req, res, next) => {
  if (!tokenMiddleware) {
    return res.status(503).json({ success: false, error: 'Payment middleware initializing' });
  }
  return tokenMiddleware(req, res, async (err: any) => {
    if (err) return next(err);
    try {
      const { game } = req.query;
      
      if (!game) {
        return res.status(400).json({
          success: false,
          error: 'Game parameter required',
          example: '/api/gaming/token?game=cryptoblades'
        });
      }

      const data = await getGameTokenPrice(game as string);
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
});

// Get overview of all games
gamingRouter.get('/overview', async (req, res, next) => {
  if (!overviewMiddleware) {
    return res.status(503).json({ success: false, error: 'Payment middleware initializing' });
  }
  return overviewMiddleware(req, res, async (err: any) => {
    if (err) return next(err);
    try {
      const data = await getAllGamesOverview();
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
});
