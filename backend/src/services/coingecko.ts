import axios from 'axios';
import { cryptoCache } from './dbCache';

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';

interface CoinGeckoMarketParams {
  vs_currency?: string;
  ids?: string;
  per_page?: number;
  page?: number;
}

export async function getCoinGeckoMarkets(params: CoinGeckoMarketParams = {}): Promise<any> {
  const {
    vs_currency = 'usd',
    ids,
    per_page = 10,
    page = 1,
  } = params;

  const cacheKey = `coingecko:markets:${vs_currency}:${ids || 'top'}:${per_page}:${page}`;
  const cached = await cryptoCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const response = await axios.get(`${COINGECKO_API_URL}/coins/markets`, {
      params: {
        vs_currency,
        ids,
        order: 'market_cap_desc',
        per_page,
        page,
        sparkline: false,
        price_change_percentage: '24h,7d',
      },
      timeout: 10000,
    });

    const result = {
      data: response.data.map((coin: any) => ({
        id: coin.id,
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        current_price: coin.current_price,
        market_cap: coin.market_cap,
        market_cap_rank: coin.market_cap_rank,
        total_volume: coin.total_volume,
        price_change_24h: coin.price_change_24h,
        price_change_percentage_24h: coin.price_change_percentage_24h,
        price_change_percentage_7d: coin.price_change_percentage_7d_in_currency,
        circulating_supply: coin.circulating_supply,
        total_supply: coin.total_supply,
        ath: coin.ath,
        ath_date: coin.ath_date,
        image: coin.image,
      })),
      vs_currency,
      timestamp: new Date().toISOString(),
    };

    // Cache for 60 seconds
    await cryptoCache.set(cacheKey, result, 60000);

    return result;
  } catch (error: any) {
    throw new Error(`CoinGecko API error: ${error.message}`);
  }
}

export async function getCoinGeckoPrice(coinId: string, vs_currency: string = 'usd'): Promise<any> {
  const cacheKey = `coingecko:price:${coinId}:${vs_currency}`;
  const cached = await cryptoCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const response = await axios.get(`${COINGECKO_API_URL}/simple/price`, {
      params: {
        ids: coinId,
        vs_currencies: vs_currency,
        include_24hr_change: true,
        include_24hr_vol: true,
        include_market_cap: true,
      },
      timeout: 10000,
    });

    const result = {
      coin: coinId,
      price: response.data[coinId][vs_currency],
      change_24h: response.data[coinId][`${vs_currency}_24h_change`],
      volume_24h: response.data[coinId][`${vs_currency}_24h_vol`],
      market_cap: response.data[coinId][`${vs_currency}_market_cap`],
      vs_currency,
      timestamp: new Date().toISOString(),
    };

    // Cache for 30 seconds
    await cryptoCache.set(cacheKey, result, 30000);

    return result;
  } catch (error: any) {
    throw new Error(`CoinGecko price fetch failed: ${error.message}`);
  }
}
