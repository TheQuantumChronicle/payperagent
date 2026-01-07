import axios from 'axios';
import { cryptoCache } from './dbCache';

interface GameStatsParams {
  game: string;
}

interface NFTPriceParams {
  game: string;
  collection?: string;
}

interface LeaderboardParams {
  game: string;
  limit?: number;
}

export async function getGameStats(params: GameStatsParams): Promise<any> {
  const { game } = params;
  
  const cacheKey = `gaming:stats:${game}`;
  const cached = await cryptoCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    // Different API endpoints for different games
    let apiUrl = '';
    switch (game.toLowerCase()) {
      case 'cryptoblades':
        apiUrl = 'https://api.cryptoblades.io/stats';
        break;
      case 'bithotel':
        apiUrl = 'https://api.bithotel.io/stats';
        break;
      default:
        throw new Error(`Game ${game} not supported`);
    }

    const response = await axios.get(apiUrl, { timeout: 5000 });

    const result = {
      game,
      players: response.data.players || 0,
      activeUsers24h: response.data.activeUsers24h || 0,
      totalTransactions: response.data.totalTransactions || 0,
      volume24h: response.data.volume24h || 0,
      tokenPrice: response.data.tokenPrice || 0,
      lastUpdated: new Date().toISOString(),
      source: `${game} API`
    };

    await cryptoCache.set(cacheKey, result, 300);
    return result;
  } catch (error: any) {
    console.error(`${game} API error:`, error.message);
    throw new Error(`Failed to fetch game stats for ${game}: ${error.message}`);
  }
}

export async function getNFTPrices(params: NFTPriceParams): Promise<any> {
  const { game, collection } = params;
  
  const cacheKey = `gaming:nft:${game}:${collection || 'all'}`;
  const cached = await cryptoCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    let apiUrl = '';
    switch (game.toLowerCase()) {
      case 'cryptoblades':
        apiUrl = 'https://api.cryptoblades.io/nft/prices';
        break;
      case 'bithotel':
        apiUrl = 'https://api.bithotel.io/nft/prices';
        break;
      default:
        throw new Error(`Game ${game} not supported`);
    }

    const response = await axios.get(apiUrl, {
      params: collection ? { collection } : {},
      timeout: 5000
    });

    const result = {
      game,
      collection: collection || 'all',
      floorPrice: response.data.floorPrice || 0,
      averagePrice: response.data.averagePrice || 0,
      volume24h: response.data.volume24h || 0,
      sales24h: response.data.sales24h || 0,
      topSales: response.data.topSales || [],
      lastUpdated: new Date().toISOString(),
      source: `${game} NFT API`
    };

    await cryptoCache.set(cacheKey, result, 300);
    return result;
  } catch (error: any) {
    console.error(`${game} NFT API error:`, error.message);
    throw new Error(`Failed to fetch NFT prices for ${game}: ${error.message}`);
  }
}

export async function getLeaderboard(params: LeaderboardParams): Promise<any> {
  const { game, limit = 10 } = params;
  
  const cacheKey = `gaming:leaderboard:${game}:${limit}`;
  const cached = await cryptoCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    let apiUrl = '';
    switch (game.toLowerCase()) {
      case 'cryptoblades':
        apiUrl = 'https://api.cryptoblades.io/leaderboard';
        break;
      case 'bithotel':
        apiUrl = 'https://api.bithotel.io/leaderboard';
        break;
      default:
        throw new Error(`Game ${game} not supported`);
    }

    const response = await axios.get(apiUrl, {
      params: { limit },
      timeout: 5000
    });

    const result = {
      game,
      leaderboard: response.data.leaderboard || [],
      lastUpdated: new Date().toISOString(),
      source: `${game} API`
    };

    await cryptoCache.set(cacheKey, result, 600);
    return result;
  } catch (error: any) {
    console.error(`${game} leaderboard API error:`, error.message);
    throw new Error(`Failed to fetch leaderboard for ${game}: ${error.message}`);
  }
}

export async function getGameTokenPrice(game: string): Promise<any> {
  const cacheKey = `gaming:token:${game}`;
  const cached = await cryptoCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    // Map games to their token symbols
    const tokenMap: Record<string, string> = {
      'cryptoblades': 'SKILL',
      'bithotel': 'BTH',
      'mystrios': 'MYS'
    };

    const tokenSymbol = tokenMap[game.toLowerCase()];
    if (!tokenSymbol) {
      throw new Error(`Token for game ${game} not found`);
    }

    // Integrate with Ruby.Exchange or CoinGecko for real token prices
    throw new Error(`Token price API not configured for ${game}. Please integrate with Ruby.Exchange or CoinGecko.`);
  } catch (error: any) {
    throw new Error(`Failed to get token price for ${game}: ${error.message}`);
  }
}

export async function getAllGamesOverview(): Promise<any> {
  const cacheKey = 'gaming:overview:all';
  const cached = await cryptoCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const games = ['cryptoblades', 'bithotel', 'mystrios', 'motodex', '5tars'];
  
  const gamesData = await Promise.all(
    games.map(async (game) => {
      try {
        const stats = await getGameStats({ game });
        return {
          game,
          ...stats
        };
      } catch (error) {
        return {
          game,
          error: 'Data unavailable',
          players: 0,
          activeUsers24h: 0
        };
      }
    })
  );

  const result = {
    totalGames: games.length,
    games: gamesData,
    totalPlayers: gamesData.reduce((sum, g) => sum + (g.players || 0), 0),
    totalActiveUsers: gamesData.reduce((sum, g) => sum + (g.activeUsers24h || 0), 0),
    lastUpdated: new Date().toISOString(),
    source: 'SKALE Gaming Ecosystem'
  };

  await cryptoCache.set(cacheKey, result, 600);
  return result;
}
