import axios from 'axios';
import { cryptoCache } from './dbCache';
import { circuitBreakers } from '../utils/circuitBreaker';
import { ExternalAPIError, ValidationError, RateLimitError } from '../utils/errors';

interface CryptoParams {
  symbol?: string;
  symbols?: string;
}

export const getCryptoPrice = async (params: CryptoParams) => {
  const symbols = params.symbol || params.symbols;

  if (!symbols) {
    throw new ValidationError('No cryptocurrency symbols provided. Use symbol or symbols parameter (e.g., BTCUSDT, ETHUSDT)');
  }

  const symbolList = symbols.toUpperCase().split(',').map(s => s.trim());
  
  // Check cache first
  const cacheKey = symbolList.sort().join(',');
  const cached = cryptoCache.get(cacheKey);
  if (cached) {
    console.log(`💾 Cache hit for crypto: ${cacheKey}`);
    return cached;
  }
  
  // Validate symbols (Binance format: BTCUSDT, ETHUSDT, etc.)
  const validSymbolPattern = /^[A-Z]{3,10}USDT$/;
  for (const symbol of symbolList) {
    if (!validSymbolPattern.test(symbol)) {
      throw new ValidationError(`Invalid symbol format: ${symbol}. Use format like BTCUSDT, ETHUSDT`);
    }
  }

  const baseUrl = 'https://api.binance.com/api/v3';

  try {
    // Fetch ticker data for all symbols
    const pricePromises = symbolList.map(async (symbol) => {
      const [tickerResponse, statsResponse] = await circuitBreakers.binance.execute(() =>
        Promise.all([
          axios.get(`${baseUrl}/ticker/price`, {
            params: { symbol },
            timeout: 5000,
          }),
          axios.get(`${baseUrl}/ticker/24hr`, {
            params: { symbol },
            timeout: 5000,
          }),
        ])
      );

      return {
        symbol,
        price: parseFloat(tickerResponse.data.price),
        priceChangePercent: parseFloat(statsResponse.data.priceChangePercent),
        high24h: parseFloat(statsResponse.data.highPrice),
        low24h: parseFloat(statsResponse.data.lowPrice),
        volume24h: parseFloat(statsResponse.data.volume),
        quoteVolume24h: parseFloat(statsResponse.data.quoteVolume),
      };
    });

    const results = await Promise.all(pricePromises);

    // Format response similar to CoinGecko for compatibility
    const formattedData: any = {};
    results.forEach((result) => {
      const baseCurrency = result.symbol.replace('USDT', '').toLowerCase();
      formattedData[baseCurrency] = {
        usd: result.price,
        usd_24h_change: result.priceChangePercent,
        usd_24h_high: result.high24h,
        usd_24h_low: result.low24h,
        usd_24h_volume: result.quoteVolume24h,
      };
    });

    // Cache the result
    cryptoCache.set(cacheKey, formattedData);
    
    return formattedData;
  } catch (error: any) {
    if (error.response?.status === 429) {
      throw new RateLimitError('Binance API rate limit exceeded. Please try again later', 60);
    }
    if (error.response?.status === 400) {
      throw new ValidationError('Invalid symbol. Use Binance format: BTCUSDT, ETHUSDT, BNBUSDT, etc.');
    }
    throw new ExternalAPIError(error.message || 'Failed to fetch cryptocurrency data from Binance', 'Binance');
  }
};
