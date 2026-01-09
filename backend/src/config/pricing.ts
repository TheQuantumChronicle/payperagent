export const API_PRICING = {
  weather: {
    amount: '0.001',
    currency: 'USDC',
    description: 'Weather data access',
  },
  crypto: {
    amount: '0.002',
    currency: 'USDC',
    description: 'Real-time cryptocurrency prices from Binance',
  },
  news: {
    amount: '0.005',
    currency: 'USDC',
    description: 'News article access',
  },
  // New Free APIs (No Auth Required)
  coingecko: {
    amount: '0.001',
    currency: 'USDC',
    description: 'Cryptocurrency market data from CoinGecko',
  },
  wikipedia: {
    amount: '0.002',
    currency: 'USDC',
    description: 'Wikipedia search and article content',
  },
  reddit: {
    amount: '0.002',
    currency: 'USDC',
    description: 'Reddit posts and discussions',
  },
  github: {
    amount: '0.003',
    currency: 'USDC',
    description: 'GitHub repository search and user data',
  },
  exchange: {
    amount: '0.001',
    currency: 'USDC',
    description: 'Currency exchange rates',
  },
  ip: {
    amount: '0.001',
    currency: 'USDC',
    description: 'IP geolocation lookup',
  },
  qr: {
    amount: '0.0005',
    currency: 'USDC',
    description: 'QR code generation',
  },
  holidays: {
    amount: '0.0005',
    currency: 'USDC',
    description: 'Public holidays by country',
  },
  hackernews: {
    amount: '0.001',
    currency: 'USDC',
    description: 'HackerNews top stories',
  },
  randomdog: {
    amount: '0.0005',
    currency: 'USDC',
    description: 'Random dog images',
  },
  randomcat: {
    amount: '0.0005',
    currency: 'USDC',
    description: 'Random cat images',
  },
  // SKALE Ecosystem Integrations
  // Ruby.Exchange (DEX)
  ruby_price: {
    amount: '0.001',
    currency: 'USDC',
    description: 'Ruby.Exchange token prices',
  },
  ruby_liquidity: {
    amount: '0.002',
    currency: 'USDC',
    description: 'Ruby.Exchange pool liquidity data',
  },
  ruby_quote: {
    amount: '0.001',
    currency: 'USDC',
    description: 'Ruby.Exchange swap quotes',
  },
  ruby_pairs: {
    amount: '0.001',
    currency: 'USDC',
    description: 'Ruby.Exchange top trading pairs',
  },
  // Chirper.ai (AI Social Network)
  chirper_trending: {
    amount: '0.003',
    currency: 'USDC',
    description: 'Chirper.ai trending topics from AI agents',
  },
  chirper_sentiment: {
    amount: '0.005',
    currency: 'USDC',
    description: 'Chirper.ai sentiment analysis',
  },
  chirper_stats: {
    amount: '0.002',
    currency: 'USDC',
    description: 'Chirper.ai network and agent statistics',
  },
  chirper_conversations: {
    amount: '0.003',
    currency: 'USDC',
    description: 'Chirper.ai AI conversations',
  },
  // Gaming APIs
  gaming_stats: {
    amount: '0.002',
    currency: 'USDC',
    description: 'SKALE gaming statistics',
  },
  gaming_nft: {
    amount: '0.003',
    currency: 'USDC',
    description: 'Gaming NFT prices and floor data',
  },
  gaming_leaderboard: {
    amount: '0.002',
    currency: 'USDC',
    description: 'Gaming leaderboards',
  },
  gaming_token: {
    amount: '0.001',
    currency: 'USDC',
    description: 'Gaming token prices',
  },
  gaming_overview: {
    amount: '0.004',
    currency: 'USDC',
    description: 'All SKALE games overview',
  },
} as const;

export type ApiEndpoint = keyof typeof API_PRICING;

export const getPricing = (service: ApiEndpoint) => {
  return API_PRICING[service];
};
