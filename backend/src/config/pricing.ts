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
  // New Free APIs
  jokes_random: {
    amount: '0.0005',
    currency: 'USDC',
    description: 'Random jokes',
  },
  jokes_type: {
    amount: '0.0005',
    currency: 'USDC',
    description: 'Jokes by type',
  },
  jokes_search: {
    amount: '0.0005',
    currency: 'USDC',
    description: 'Search jokes',
  },
  bored: {
    amount: '0.0005',
    currency: 'USDC',
    description: 'Activity suggestions',
  },
  name_age: {
    amount: '0.0005',
    currency: 'USDC',
    description: 'Predict age from name',
  },
  name_gender: {
    amount: '0.0005',
    currency: 'USDC',
    description: 'Predict gender from name',
  },
  name_nationality: {
    amount: '0.0005',
    currency: 'USDC',
    description: 'Predict nationality from name',
  },
  name_all: {
    amount: '0.001',
    currency: 'USDC',
    description: 'Predict age, gender, and nationality',
  },
  // Cat Facts API
  catfact_random: {
    amount: '0.0005',
    currency: 'USDC',
    description: 'Random cat fact',
  },
  catfact_multiple: {
    amount: '0.001',
    currency: 'USDC',
    description: 'Multiple cat facts',
  },
  // Universities API
  universities: {
    amount: '0.0005',
    currency: 'USDC',
    description: 'Search universities by country or name',
  },
  // REST Countries API
  countries_all: {
    amount: '0.002',
    currency: 'USDC',
    description: 'Get all countries data',
  },
  countries_name: {
    amount: '0.0005',
    currency: 'USDC',
    description: 'Get country by name',
  },
  countries_code: {
    amount: '0.0005',
    currency: 'USDC',
    description: 'Get country by code',
  },
  // Advice Slip API
  advice_random: {
    amount: '0.0005',
    currency: 'USDC',
    description: 'Random advice',
  },
  advice_search: {
    amount: '0.0005',
    currency: 'USDC',
    description: 'Search advice',
  },
  // Zipcode API
  zipcode: {
    amount: '0.0005',
    currency: 'USDC',
    description: 'Zip code location lookup',
  },
  // Random User API
  randomuser: {
    amount: '0.0005',
    currency: 'USDC',
    description: 'Generate random user profiles',
  },
  // Open Library API
  openlibrary_search: {
    amount: '0.0005',
    currency: 'USDC',
    description: 'Search books',
  },
  openlibrary_isbn: {
    amount: '0.0005',
    currency: 'USDC',
    description: 'Get book by ISBN',
  },
  // Rick and Morty API
  rickmorty_characters: {
    amount: '0.0005',
    currency: 'USDC',
    description: 'Get Rick and Morty characters',
  },
  rickmorty_character: {
    amount: '0.0005',
    currency: 'USDC',
    description: 'Get specific character',
  },
  rickmorty_episodes: {
    amount: '0.0005',
    currency: 'USDC',
    description: 'Get Rick and Morty episodes',
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
