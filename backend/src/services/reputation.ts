import pool from '../config/database';

export interface AgentReputation {
  walletAddress: string;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  successRate: number;
  totalSpent: number;
  averageRequestCost: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  discount: number;
  firstSeen: Date;
  lastSeen: Date;
  favoriteEndpoints: Array<{ endpoint: string; count: number }>;
}

export interface TierConfig {
  name: string;
  minRequests: number;
  minSuccessRate: number;
  discount: number;
  color: string;
}

export const REPUTATION_TIERS: Record<string, TierConfig> = {
  bronze: {
    name: 'Bronze',
    minRequests: 0,
    minSuccessRate: 0,
    discount: 0,
    color: '#CD7F32'
  },
  silver: {
    name: 'Silver',
    minRequests: 100,
    minSuccessRate: 0.85,
    discount: 0.05, // 5% off
    color: '#C0C0C0'
  },
  gold: {
    name: 'Gold',
    minRequests: 500,
    minSuccessRate: 0.90,
    discount: 0.10, // 10% off
    color: '#FFD700'
  },
  platinum: {
    name: 'Platinum',
    minRequests: 2000,
    minSuccessRate: 0.95,
    discount: 0.15, // 15% off
    color: '#E5E4E2'
  },
  diamond: {
    name: 'Diamond',
    minRequests: 10000,
    minSuccessRate: 0.98,
    discount: 0.20, // 20% off
    color: '#B9F2FF'
  }
};

export async function getAgentReputation(walletAddress: string): Promise<AgentReputation | null> {
  try {
    // Normalize wallet address to lowercase for consistency
    const normalizedAddress = walletAddress.toLowerCase();
    
    const result = await pool.query(
      `SELECT 
        wallet_address,
        COUNT(*) as total_requests,
        SUM(CASE WHEN status_code < 400 THEN 1 ELSE 0 END) as successful_requests,
        SUM(CASE WHEN status_code >= 400 THEN 1 ELSE 0 END) as failed_requests,
        COALESCE(SUM(amount), 0) as total_spent,
        MIN(created_at) as first_seen,
        MAX(created_at) as last_seen
      FROM analytics
      WHERE LOWER(wallet_address) = $1
      GROUP BY wallet_address`,
      [normalizedAddress]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const data = result.rows[0];
    const totalRequests = parseInt(data.total_requests);
    const successfulRequests = parseInt(data.successful_requests);
    const failedRequests = parseInt(data.failed_requests);
    const totalSpent = parseFloat(data.total_spent || 0);
    const successRate = totalRequests > 0 ? successfulRequests / totalRequests : 0;
    const averageRequestCost = totalRequests > 0 ? totalSpent / totalRequests : 0;

    // Get favorite endpoints
    const endpointsResult = await pool.query(
      `SELECT endpoint, COUNT(*) as count
      FROM analytics
      WHERE LOWER(wallet_address) = $1
      GROUP BY endpoint
      ORDER BY count DESC
      LIMIT 5`,
      [normalizedAddress]
    );

    const favoriteEndpoints = endpointsResult.rows.map((row: any) => ({
      endpoint: row.endpoint,
      count: parseInt(row.count)
    }));

    // Calculate tier
    const tier = calculateTier(totalRequests, successRate);
    const discount = REPUTATION_TIERS[tier].discount;

    return {
      walletAddress,
      totalRequests,
      successfulRequests,
      failedRequests,
      successRate: parseFloat(successRate.toFixed(4)),
      totalSpent: parseFloat(totalSpent.toFixed(6)),
      averageRequestCost: parseFloat(averageRequestCost.toFixed(6)),
      tier,
      discount,
      firstSeen: data.first_seen,
      lastSeen: data.last_seen,
      favoriteEndpoints
    };
  } catch (error) {
    console.error('Error getting agent reputation:', error);
    return null;
  }
}

export function calculateTier(totalRequests: number, successRate: number): 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' {
  if (totalRequests >= 10000 && successRate >= 0.98) return 'diamond';
  if (totalRequests >= 2000 && successRate >= 0.95) return 'platinum';
  if (totalRequests >= 500 && successRate >= 0.90) return 'gold';
  if (totalRequests >= 100 && successRate >= 0.85) return 'silver';
  return 'bronze';
}

export async function getLeaderboard(limit: number = 10): Promise<AgentReputation[]> {
  try {
    // Ensure limit is within bounds
    const safeLimit = Math.max(1, Math.min(limit, 100));
    
    const result = await pool.query(
      `SELECT 
        wallet_address,
        COUNT(*) as total_requests,
        SUM(CASE WHEN status_code < 400 THEN 1 ELSE 0 END) as successful_requests,
        COALESCE(SUM(amount), 0) as total_spent,
        MIN(created_at) as first_seen,
        MAX(created_at) as last_seen
      FROM analytics
      GROUP BY wallet_address
      HAVING COUNT(*) >= 10
      ORDER BY total_requests DESC, total_spent DESC
      LIMIT $1`,
      [safeLimit]
    );

    const leaderboard: AgentReputation[] = [];

    for (const row of result.rows) {
      const totalRequests = parseInt(row.total_requests);
      const successfulRequests = parseInt(row.successful_requests);
      const totalSpent = parseFloat(row.total_spent || 0);
      const successRate = totalRequests > 0 ? successfulRequests / totalRequests : 0;
      const tier = calculateTier(totalRequests, successRate);

      leaderboard.push({
        walletAddress: row.wallet_address,
        totalRequests,
        successfulRequests,
        failedRequests: totalRequests - successfulRequests,
        successRate: parseFloat(successRate.toFixed(4)),
        totalSpent: parseFloat(totalSpent.toFixed(6)),
        averageRequestCost: parseFloat((totalSpent / totalRequests).toFixed(6)),
        tier,
        discount: REPUTATION_TIERS[tier].discount,
        firstSeen: row.first_seen,
        lastSeen: row.last_seen,
        favoriteEndpoints: []
      });
    }

    return leaderboard;
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    return [];
  }
}

export function applyReputationDiscount(basePrice: number, tier: string): number {
  const discount = REPUTATION_TIERS[tier]?.discount || 0;
  return basePrice * (1 - discount);
}

export async function trackAgentActivity(
  walletAddress: string,
  endpoint: string,
  statusCode: number,
  amount: number
): Promise<void> {
  try {
    await pool.query(
      `INSERT INTO analytics (wallet_address, endpoint, status_code, amount, created_at)
      VALUES ($1, $2, $3, $4, NOW())`,
      [walletAddress, endpoint, statusCode, amount]
    );
  } catch (error) {
    console.error('Error tracking agent activity:', error);
  }
}
