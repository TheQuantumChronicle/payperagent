# PayPerAgent TypeScript SDK

Official TypeScript/JavaScript SDK for PayPerAgent API Gateway.

## Installation

```bash
npm install @payperagent/sdk ethers
```

## Quick Start

```typescript
import { createClient } from '@payperagent/sdk';
import { ethers } from 'ethers';

// Create wallet for payments
const wallet = new ethers.Wallet('your-private-key');

// Initialize client
const client = createClient({
  gatewayUrl: 'https://payperagent.xyz',
  wallet: wallet,
  autoRetry: true, // Automatically handle payments
});

// Get crypto prices
const cryptoData = await client.getCrypto({ symbol: 'BTCUSDT' });
console.log('BTC Price:', cryptoData.btc.usd);

// Get weather
const weather = await client.getWeather({ city: 'London' });
console.log('Temperature:', weather.temperature);

// Get news
const news = await client.getNews({ category: 'technology', pageSize: 5 });
console.log('Articles:', news.articles);
```

## Features

- ✅ Automatic payment handling with SKALE Network
- ✅ Zero gas fees
- ✅ TypeScript support with full type definitions
- ✅ Automatic retry on 402 Payment Required
- ✅ Built-in error handling

## API Reference

### `createClient(config)`

Create a new PayPerAgent client.

**Parameters:**
- `gatewayUrl` (string): URL of the PayPerAgent gateway
- `wallet` (ethers.Wallet, optional): Wallet for signing payments
- `autoRetry` (boolean, optional): Auto-retry with payment on 402 (default: true)

### `client.getCrypto(params)`

Get cryptocurrency prices.

**Parameters:**
- `symbol` (string, optional): Single symbol (e.g., 'BTCUSDT')
- `symbols` (string, optional): Comma-separated symbols

**Returns:** `Promise<CryptoData>`

### `client.getWeather(params)`

Get weather data.

**Parameters:**
- `city` (string, optional): City name
- `lat` (string, optional): Latitude
- `lon` (string, optional): Longitude

**Returns:** `Promise<WeatherData>`

### `client.getNews(params)`

Get news articles.

**Parameters:**
- `query` (string, optional): Search query
- `category` (string, optional): News category
- `country` (string, optional): Country code
- `pageSize` (number, optional): Number of articles

**Returns:** `Promise<NewsData>`

## Payment Flow

The SDK automatically handles the x402 payment flow:

1. Makes request without payment
2. If 402 received, generates payment proof
3. Signs payment with your wallet (zero gas on SKALE!)
4. Retries request with payment proof
5. Returns data

## Examples

### Multiple Cryptocurrencies

```typescript
const data = await client.getCrypto({
  symbols: 'BTCUSDT,ETHUSDT,BNBUSDT'
});

console.log('BTC:', data.btc.usd);
console.log('ETH:', data.eth.usd);
console.log('BNB:', data.bnb.usd);
```

### Weather by Coordinates

```typescript
const weather = await client.getWeather({
  lat: '40.7128',
  lon: '-74.0060'
});

console.log(`${weather.location}: ${weather.temperature}°C`);
```

### News Search

```typescript
const news = await client.getNews({
  query: 'AI',
  country: 'us',
  pageSize: 10
});

news.articles.forEach(article => {
  console.log(article.title);
});
```

## Error Handling

```typescript
try {
  const data = await client.getCrypto({ symbol: 'BTCUSDT' });
} catch (error) {
  if (error.response?.status === 402) {
    console.error('Payment required but wallet not configured');
  } else {
    console.error('Request failed:', error.message);
  }
}
```

## License

MIT
