import axios from 'axios';
import { cryptoCache } from './dbCache';

const RUBY_API_URL = 'https://api.ruby.exchange/v1';

interface TokenPriceParams {
  token: string;
  pair?: string;
}

interface LiquidityParams {
  pool: string;
}

interface SwapQuoteParams {
  fromToken: string;
  toToken: string;
  amount: string;
}

export async function getTokenPrice(params: TokenPriceParams): Promise<any> {
  const { token, pair = 'USDC' } = params;
  
  const cacheKey = `ruby:price:${token}:${pair}`;
  const cached = await cryptoCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    // Ruby.Exchange API integration
    // Note: This is a placeholder - actual Ruby.Exchange API endpoints may differ
    const response = await axios.get(`${RUBY_API_URL}/price`, {
      params: {
        token,
        pair
      },
      timeout: 5000
    });

    const result = {
      token,
      pair,
      price: response.data.price || 0,
      volume24h: response.data.volume24h || 0,
      priceChange24h: response.data.priceChange24h || 0,
      lastUpdated: new Date().toISOString(),
      source: 'Ruby.Exchange'
    };

    await cryptoCache.set(cacheKey, result, 30);
    return result;
  } catch (error: any) {
    console.error('Ruby.Exchange API error:', error.message);
    throw new Error(`Failed to fetch token price from Ruby.Exchange: ${error.message}`);
  }
}

export async function getPoolLiquidity(params: LiquidityParams): Promise<any> {
  const { pool } = params;
  
  const cacheKey = `ruby:liquidity:${pool}`;
  const cached = await cryptoCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const response = await axios.get(`${RUBY_API_URL}/liquidity`, {
      params: { pool },
      timeout: 5000
    });

    const result = {
      pool,
      totalLiquidity: response.data.totalLiquidity || 0,
      token0Reserve: response.data.token0Reserve || 0,
      token1Reserve: response.data.token1Reserve || 0,
      volume24h: response.data.volume24h || 0,
      fees24h: response.data.fees24h || 0,
      apr: response.data.apr || 0,
      lastUpdated: new Date().toISOString(),
      source: 'Ruby.Exchange'
    };

    await cryptoCache.set(cacheKey, result, 60);
    return result;
  } catch (error: any) {
    console.error('Ruby.Exchange liquidity API error:', error.message);
    throw new Error(`Failed to fetch pool liquidity from Ruby.Exchange: ${error.message}`);
  }
}

export async function getSwapQuote(params: SwapQuoteParams): Promise<any> {
  const { fromToken, toToken, amount } = params;
  
  const cacheKey = `ruby:quote:${fromToken}:${toToken}:${amount}`;
  const cached = await cryptoCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const response = await axios.get(`${RUBY_API_URL}/quote`, {
      params: {
        fromToken,
        toToken,
        amount
      },
      timeout: 5000
    });

    const result = {
      fromToken,
      toToken,
      amountIn: amount,
      amountOut: response.data.amountOut || 0,
      priceImpact: response.data.priceImpact || 0,
      fee: response.data.fee || 0,
      route: response.data.route || [],
      estimatedGas: 0, // Zero gas on SKALE
      lastUpdated: new Date().toISOString(),
      source: 'Ruby.Exchange'
    };

    await cryptoCache.set(cacheKey, result, 15);
    return result;
  } catch (error: any) {
    console.error('Ruby.Exchange swap quote API error:', error.message);
    throw new Error(`Failed to fetch swap quote from Ruby.Exchange: ${error.message}`);
  }
}

export async function getTopPairs(limit: number = 10): Promise<any> {
  const cacheKey = `ruby:top-pairs:${limit}`;
  const cached = await cryptoCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const response = await axios.get(`${RUBY_API_URL}/pairs/top`, {
      params: { limit },
      timeout: 5000
    });

    const result = {
      pairs: response.data.pairs || [],
      lastUpdated: new Date().toISOString(),
      source: 'Ruby.Exchange'
    };

    await cryptoCache.set(cacheKey, result, 300);
    return result;
  } catch (error: any) {
    console.error('Ruby.Exchange top pairs API error:', error.message);
    throw new Error(`Failed to fetch top pairs from Ruby.Exchange: ${error.message}`);
  }
}
