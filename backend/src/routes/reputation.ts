import { Router } from 'express';
import { getAgentReputation, getLeaderboard, REPUTATION_TIERS } from '../services/reputation';
import { getSupportedTokens } from '../middleware/multiToken';

export const reputationRouter = Router();

// Get agent reputation by wallet address
reputationRouter.get('/agent/:address', async (req, res) => {
  try {
    const { address } = req.params;
    
    // Validate wallet address format
    if (!address || !address.startsWith('0x') || address.length !== 42) {
      return res.status(400).json({
        success: false,
        error: 'Valid Ethereum wallet address required (0x + 40 hex characters)',
        example: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'
      });
    }

    const reputation = await getAgentReputation(address);

    if (!reputation) {
      return res.json({
        success: true,
        message: 'Agent not found',
        reputation: {
          walletAddress: address,
          totalRequests: 0,
          tier: 'bronze',
          discount: 0
        }
      });
    }

    return res.json({
      success: true,
      reputation
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get leaderboard
reputationRouter.get('/leaderboard', async (req, res) => {
  try {
    const limitParam = req.query.limit as string;
    const limit = limitParam ? parseInt(limitParam, 10) : 10;
    
    // Validate limit parameter
    if (isNaN(limit) || limit < 1) {
      return res.status(400).json({
        success: false,
        error: 'Invalid limit parameter. Must be a positive number.',
        example: '/api/reputation/leaderboard?limit=10'
      });
    }
    
    const leaderboard = await getLeaderboard(Math.min(limit, 100));

    return res.json({
      success: true,
      leaderboard,
      total: leaderboard.length,
      limit: Math.min(limit, 100)
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch leaderboard',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get reputation tiers info
reputationRouter.get('/tiers', async (_req, res) => {
  try {
    res.json({
      success: true,
      tiers: Object.entries(REPUTATION_TIERS).map(([key, config]) => ({
        tier: key,
        ...config
      }))
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get supported payment tokens
reputationRouter.get('/tokens', async (_req, res) => {
  try {
    const tokens = getSupportedTokens();
    
    res.json({
      success: true,
      tokens: tokens.map(token => ({
        symbol: token.symbol,
        decimals: token.decimals,
        network: token.network,
        conversionRate: token.conversionRate
      })),
      note: 'Use X-PAYMENT-TOKEN and X-PAYMENT-AMOUNT headers to pay with alternative tokens'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get agent statistics
reputationRouter.get('/stats', async (req, res) => {
  try {
    const { address } = req.query;

    if (!address || typeof address !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Wallet address required as query parameter',
        example: '/api/reputation/stats?address=0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'
      });
    }
    
    // Validate wallet address format
    if (!address.startsWith('0x') || address.length !== 42) {
      return res.status(400).json({
        success: false,
        error: 'Invalid wallet address format',
        example: '/api/reputation/stats?address=0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'
      });
    }

    const reputation = await getAgentReputation(address);

    if (!reputation) {
      return res.json({
        success: true,
        message: 'No statistics available for this agent',
        stats: null
      });
    }

    const tierInfo = REPUTATION_TIERS[reputation.tier];
    const nextTier = getNextTier(reputation.tier);
    const nextTierInfo = nextTier ? REPUTATION_TIERS[nextTier] : null;

    return res.json({
      success: true,
      stats: {
        current: {
          tier: reputation.tier,
          tierName: tierInfo.name,
          discount: `${tierInfo.discount * 100}%`,
          totalRequests: reputation.totalRequests,
          successRate: `${(reputation.successRate * 100).toFixed(2)}%`,
          totalSpent: `${reputation.totalSpent} USDC`,
          averageCost: `${reputation.averageRequestCost} USDC`
        },
        nextTier: nextTierInfo ? {
          tier: nextTier,
          tierName: nextTierInfo.name,
          discount: `${nextTierInfo.discount * 100}%`,
          requiredRequests: nextTierInfo.minRequests,
          requiredSuccessRate: `${nextTierInfo.minSuccessRate * 100}%`,
          requestsNeeded: Math.max(0, nextTierInfo.minRequests - reputation.totalRequests),
          successRateNeeded: Math.max(0, nextTierInfo.minSuccessRate - reputation.successRate)
        } : null,
        favoriteEndpoints: reputation.favoriteEndpoints
      }
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

function getNextTier(currentTier: string): string | null {
  const tiers = ['bronze', 'silver', 'gold', 'platinum', 'diamond'];
  const currentIndex = tiers.indexOf(currentTier);
  
  if (currentIndex === -1 || currentIndex === tiers.length - 1) {
    return null;
  }
  
  return tiers[currentIndex + 1];
}
