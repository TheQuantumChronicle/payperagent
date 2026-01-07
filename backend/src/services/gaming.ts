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
    console.error
    
    const mockData = {
      game,
      players: Math.floor(10000 + Math.random() * 90000),
      activeUsers24h: Math.floor(5000 + Math.random() * 45000),
      totalTransactions: Math.floor(1000000 + Math.random() * 9000000),
      volume24h: Math.floor(50000 + Math.random() * 450000),
      tokenPrice: parseFloat((0.01 + Math.random() * 0.99).toFixed(4)),
      nftFloorPrice: parseFloat((0.1 + Math.random() * 9.9).toFixed(2)),
      averageSessionTime: Math.floor(15 + Math.random() * 45) + ' minutes',
      lastUpdated: new Date().toISOString(),
      source: `${game} (Mock)`,
      note: 'Using mock data - integrate with actual game API'
    };
    
    await cryptoCache.set(cacheKey, mockData, 300);
    return mockData;
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
    console.error
    
    const mockCollections = collection ? [collection] : ['Weapons', 'Characters', 'Land', 'Items'];
    const mockData = {
      game,
      collection: collection || 'all',
      collections: mockCollections.map(col => ({
        name: col,
        floorPrice: parseFloat((0.1 + Math.random() * 9.9).toFixed(2)),
        averagePrice: parseFloat((0.5 + Math.random() * 19.5).toFixed(2)),
        volume24h: Math.floor(1000 + Math.random() * 49000),
        sales24h: Math.floor(10 + Math.random() * 490),
        totalSupply: Math.floor(1000 + Math.random() * 9000)
      })),
      topSales: [
        { tokenId: '#1234', price: 15.5, buyer: '0x123...', timestamp: new Date().toISOString() },
        { tokenId: '#5678', price: 12.3, buyer: '0x456...', timestamp: new Date().toISOString() },
        { tokenId: '#9012', price: 10.8, buyer: '0x789...', timestamp: new Date().toISOString() }
      ],
      lastUpdated: new Date().toISOString(),
      source: `${game} NFT (Mock)`,
      note: 'Using mock data - integrate with actual game NFT API'
    };
    
    await cryptoCache.set(cacheKey, mockData, 300);
    return mockData;
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
    console.error
    
    const mockLeaderboard = Array.from({ length: limit }, (_, i) => ({
      rank: i + 1,
      player: `Player${i + 1}`,
      address: `0x${Math.random().toString(16).substr(2, 40)}`,
      score: Math.floor(100000 - i * 5000 - Math.random() * 4000),
      wins: Math.floor(500 - i * 20 - Math.random() * 15),
      losses: Math.floor(100 + i * 5 + Math.random() * 10),
      earnings: parseFloat((1000 - i * 50 - Math.random() * 40).toFixed(2)),
      level: Math.floor(50 - i * 2)
    }));
    
    const mockData = {
      game,
      leaderboard: mockLeaderboard,
      totalPlayers: 50000,
      lastUpdated: new Date().toISOString(),
      source: `${game} (Mock)`,
      note: 'Using mock data - integrate with actual game API'
    };
    
    await cryptoCache.set(cacheKey, mockData, 600);
    return mockData;
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

    // Could integrate with Ruby.Exchange or CoinGecko here
    const mockData = {
      game,
      token: tokenSymbol,
      price: parseFloat((0.01 + Math.random() * 0.99).toFixed(4)),
      priceChange24h: parseFloat(((Math.random() - 0.5) * 20).toFixed(2)),
      volume24h: Math.floor(50000 + Math.random() * 450000),
      marketCap: Math.floor(1000000 + Math.random() * 9000000),
      circulatingSupply: Math.floor(10000000 + Math.random() * 90000000),
      lastUpdated: new Date().toISOString(),
      source: 'Gaming Token Price (Mock)',
      note: 'Using mock data - integrate with DEX/CoinGecko API'
    };
    
    await cryptoCache.set(cacheKey, mockData, 60);
    return mockData;
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
