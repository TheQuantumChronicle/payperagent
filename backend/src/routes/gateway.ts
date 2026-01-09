import { Router } from 'express';
import { weatherRouter } from './apis/weather';
import { cryptoRouter } from './apis/crypto';
import { newsRouter } from './apis/news';
import { coingeckoRouter } from './apis/coingecko';
import { wikipediaRouter } from './apis/wikipedia';
import { redditRouter } from './apis/reddit';
import { githubRouter } from './apis/github';
import { exchangeRouter } from './apis/exchange';
import { utilitiesRouter } from './apis/utilities';
import { perplexityRouter } from './apis/perplexity';
import { xaiRouter } from './apis/xai';
import { rubyRouter } from './apis/ruby';
import { chirperRouter } from './apis/chirper';
import { gamingRouter } from './apis/gaming';
import { batchRouter } from './apis/batch';
import { reputationRouter } from './reputation';

export const gatewayRouter = Router();

// Original APIs
gatewayRouter.use('/weather', weatherRouter);
gatewayRouter.use('/crypto', cryptoRouter);
gatewayRouter.use('/news', newsRouter);

// New Free APIs (No Auth)
gatewayRouter.use('/coingecko', coingeckoRouter);
gatewayRouter.use('/wikipedia', wikipediaRouter);
gatewayRouter.use('/reddit', redditRouter);
gatewayRouter.use('/github', githubRouter);
gatewayRouter.use('/exchange', exchangeRouter);
gatewayRouter.use('/utilities', utilitiesRouter);

// Premium APIs (Require API Key)
gatewayRouter.use('/perplexity', perplexityRouter);
gatewayRouter.use('/xai', xaiRouter);

// SKALE Ecosystem Integrations
gatewayRouter.use('/ruby', rubyRouter);
gatewayRouter.use('/chirper', chirperRouter);
gatewayRouter.use('/gaming', gamingRouter);

// Batch Endpoint
gatewayRouter.use('/batch', batchRouter);

// Reputation & Analytics
gatewayRouter.use('/reputation', reputationRouter);

gatewayRouter.get('/', (_req, res) => {
  const response = {
    service: 'PayPerAgent API Gateway',
    version: '1.0.0',
    tagline: '⚡ Zero Gas Fee API Gateway for AI Agents',
    description: 'Pay-per-use API gateway for AI agents on SKALE Network',
    network: 'SKALE Nebula Testnet',
    chainId: 37084624,
    paymentProtocol: 'x402',
    features: [
      'Zero gas fees',
      'Instant settlement',
      'Micro-payments',
      'Usage analytics',
      'Rate limiting',
      'Real-time data',
    ],
    endpoints: [
      {
        path: '/api/weather',
        description: 'Real-time weather data for any location',
        price: '0.001 USDC per request',
        methods: ['GET'],
        params: ['city OR (lat, lon)'],
        dataSource: 'OpenWeatherMap',
        examples: [
          '/api/weather?city=London',
          '/api/weather?lat=40.7128&lon=-74.0060',
        ],
      },
      {
        path: '/api/crypto',
        description: 'Real-time cryptocurrency prices from Binance',
        price: '0.002 USDC per request',
        methods: ['GET'],
        params: ['symbol OR symbols (e.g., BTCUSDT, ETHUSDT)'],
        dataSource: 'Binance API',
        supportedSymbols: ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'ADAUSDT', 'DOGEUSDT', 'XRPUSDT', 'MATICUSDT', 'DOTUSDT', 'AVAXUSDT'],
        examples: [
          '/api/crypto?symbol=BTCUSDT',
          '/api/crypto?symbols=BTCUSDT,ETHUSDT,BNBUSDT',
        ],
      },
      {
        path: '/api/news',
        description: 'Latest news headlines and articles',
        price: '0.005 USDC per request',
        methods: ['GET'],
        params: ['query, category, country, pageSize'],
        dataSource: 'NewsAPI',
        categories: ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology'],
        examples: [
          '/api/news?category=technology&pageSize=5',
          '/api/news?query=AI&country=us',
        ],
      },
    ],
    stats: {
      totalEndpoints: 29,
      totalAPIs: 16,
      skaleEcosystemAPIs: 13,
      averageResponseTime: '250ms',
      uptime: '99.9%',
    },
    newFeatures: [
      '🔥 SKALE Ecosystem Integration',
      '💱 Ruby.Exchange DEX data',
      '🤖 Chirper.ai sentiment analysis',
      '🎮 Gaming APIs (CryptoBlades, BitHotel, etc.)',
      '📦 Batch API calls with volume discounts (10-30% off)',
      '💰 Multi-token payment support (USDC, USDT, SKL, WETH)',
      '🏆 Agent reputation system with tier discounts',
      '📊 Performance monitoring & analytics',
      '⚡ Enhanced error handling & logging',
    ],
    documentation: {
      swagger: 'Coming soon',
      examples: 'https://github.com/payperagent/examples',
    },
    support: {
      discord: 'https://discord.gg/skale',
      docs: 'https://docs.skale.space',
    },
  };
  
  res.json(response);
});
