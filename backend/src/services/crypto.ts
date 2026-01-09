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
        priceChange: parseFloat(statsResponse.data.priceChange),
        priceChangePercent: parseFloat(statsResponse.data.priceChangePercent),
        weightedAvgPrice: parseFloat(statsResponse.data.weightedAvgPrice),
        prevClosePrice: parseFloat(statsResponse.data.prevClosePrice),
        lastPrice: parseFloat(statsResponse.data.lastPrice),
        lastQty: parseFloat(statsResponse.data.lastQty),
        bidPrice: parseFloat(statsResponse.data.bidPrice),
        bidQty: parseFloat(statsResponse.data.bidQty),
        askPrice: parseFloat(statsResponse.data.askPrice),
        askQty: parseFloat(statsResponse.data.askQty),
        openPrice: parseFloat(statsResponse.data.openPrice),
        high24h: parseFloat(statsResponse.data.highPrice),
        low24h: parseFloat(statsResponse.data.lowPrice),
        volume24h: parseFloat(statsResponse.data.volume),
        quoteVolume24h: parseFloat(statsResponse.data.quoteVolume),
        openTime: new Date(statsResponse.data.openTime).toISOString(),
        closeTime: new Date(statsResponse.data.closeTime).toISOString(),
        firstId: statsResponse.data.firstId,
        lastId: statsResponse.data.lastId,
        count: statsResponse.data.count,
      };
    });

    const results = await Promise.all(pricePromises);

    // Format response similar to CoinGecko for compatibility
    const formattedData: any = {};
    results.forEach((result) => {
      const baseCurrency = result.symbol.replace('USDT', '').toLowerCase();
      formattedData[baseCurrency] = {
        symbol: result.symbol,
        price: {
          current: result.price,
          change_24h: result.priceChange,
          change_percent_24h: result.priceChangePercent,
          high_24h: result.high24h,
          low_24h: result.low24h,
          open: result.openPrice,
          prev_close: result.prevClosePrice,
          weighted_avg: result.weightedAvgPrice,
        },
        orderbook: {
          bid_price: result.bidPrice,
          bid_qty: result.bidQty,
          ask_price: result.askPrice,
          ask_qty: result.askQty,
          spread: result.askPrice - result.bidPrice,
          spread_percent: ((result.askPrice - result.bidPrice) / result.bidPrice * 100).toFixed(4),
        },
        volume: {
          base_24h: result.volume24h,
          quote_24h: result.quoteVolume24h,
          last_trade_qty: result.lastQty,
          trade_count_24h: result.count,
        },
        timestamps: {
          open_time: result.openTime,
          close_time: result.closeTime,
        },
        usd: result.price,
        usd_24h_change: result.priceChangePercent,
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
