import axios from 'axios';
import { cryptoCache } from './dbCache';

const EXCHANGE_API_URL = 'https://open.er-api.com/v6/latest';

interface ExchangeRateParams {
  base?: string;
  symbols?: string[];
}

export async function getExchangeRates(params: ExchangeRateParams = {}): Promise<any> {
  const { base = 'USD', symbols } = params;

  const cacheKey = `exchange:${base}:${symbols?.join(',') || 'all'}`;
  const cached = await cryptoCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const response = await axios.get(`${EXCHANGE_API_URL}/${base}`, {
      timeout: 10000,
    });

    let rates = response.data.rates;

    // Filter to specific symbols if requested
    if (symbols && symbols.length > 0) {
      rates = Object.keys(rates)
        .filter(key => symbols.includes(key))
        .reduce((obj: any, key) => {
          obj[key] = rates[key];
          return obj;
        }, {});
    }

    const result = {
      base,
      rates,
      timestamp: response.data.time_last_update_utc,
    };

    // Cache for 1 hour
    await cryptoCache.set(cacheKey, result, 3600000);

    return result;
  } catch (error: any) {
    throw new Error(`Exchange rate API error: ${error.message}`);
  }
}

export async function convertCurrency(amount: number, from: string, to: string): Promise<any> {
  const cacheKey = `exchange:convert:${from}:${to}`;
  const cached = await cryptoCache.get(cacheKey);
  
  let rate;
  if (cached) {
    rate = cached;
  } else {
    const response = await axios.get(`${EXCHANGE_API_URL}/${from}`, {
      timeout: 10000,
    });
    rate = response.data.rates[to];
    
    if (!rate) {
      throw new Error(`Currency ${to} not found`);
    }

    // Cache rate for 1 hour
    await cryptoCache.set(cacheKey, rate, 3600000);
  }

  return {
    amount,
    from,
    to,
    rate,
    converted: amount * rate,
    timestamp: new Date().toISOString(),
  };
}
