/**
 * PayPerAgent TypeScript SDK Example
 * 
 * This example demonstrates how to use the PayPerAgent SDK
 * to access premium APIs with automatic x402 payment handling.
 */

import { createClient } from '@payperagent/sdk';
import { ethers } from 'ethers';
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
  // 1. Create wallet from private key
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    throw new Error('PRIVATE_KEY environment variable is required');
  }
  
  const wallet = new ethers.Wallet(privateKey);
  console.log('🔑 Wallet Address:', wallet.address);

  // 2. Initialize PayPerAgent client
  const client = createClient({
    gatewayUrl: process.env.API_URL || 'https://payperagent.xyz',
    wallet: wallet,
    autoRetry: true, // Automatically handle 402 Payment Required
    maxRetries: 3,
  });

  console.log('✅ PayPerAgent client initialized\n');

  // 3. Example: Get Weather Data
  console.log('🌤️  Getting weather for London...');
  try {
    const weather = await client.getWeather({ city: 'London' });
    console.log('Temperature:', weather.temperature, '°C');
    console.log('Condition:', weather.condition);
    console.log('Humidity:', weather.humidity, '%\n');
  } catch (error) {
    console.error('Weather API error:', error);
  }

  // 4. Example: Get Crypto Prices
  console.log('💰 Getting crypto prices...');
  try {
    const crypto = await client.getCrypto({ symbol: 'BTCUSDT' });
    console.log('BTC Price:', crypto.price, 'USDT');
    console.log('24h Change:', crypto.change24h, '\n');
  } catch (error) {
    console.error('Crypto API error:', error);
  }

  // 5. Example: Get News Headlines
  console.log('📰 Getting tech news...');
  try {
    const news = await client.getNews({ 
      category: 'technology', 
      pageSize: 3 
    });
    console.log('Found', news.articles.length, 'articles:');
    news.articles.forEach((article: any, i: number) => {
      console.log(`${i + 1}. ${article.title}`);
    });
    console.log();
  } catch (error) {
    console.error('News API error:', error);
  }

  // 6. Example: Batch API Calls
  console.log('📦 Making batch API calls...');
  try {
    const [weatherData, cryptoData, newsData] = await Promise.all([
      client.getWeather({ city: 'Tokyo' }),
      client.getCrypto({ symbol: 'ETHUSDT' }),
      client.getNews({ category: 'business', pageSize: 2 }),
    ]);
    
    console.log('✅ Batch calls completed successfully');
    console.log('Tokyo Temperature:', weatherData.temperature, '°C');
    console.log('ETH Price:', cryptoData.price, 'USDT');
    console.log('Business News:', newsData.articles.length, 'articles\n');
  } catch (error) {
    console.error('Batch API error:', error);
  }

  // 7. Example: AI-Powered Search (Perplexity)
  console.log('🤖 Using Perplexity AI...');
  try {
    const aiResponse = await client.post('/api/perplexity', {
      query: 'What is SKALE Network and why does it have zero gas fees?',
    });
    console.log('AI Response:', aiResponse.data.answer.substring(0, 200) + '...\n');
  } catch (error) {
    console.error('Perplexity API error:', error);
  }

  // 8. Example: Check Your Usage Stats
  console.log('📊 Checking usage statistics...');
  try {
    const stats = await client.get('/analytics/usage');
    console.log('Total Requests:', stats.data.overview.totalRequests);
    console.log('Success Rate:', stats.data.overview.successRate);
    console.log('Total Spent:', stats.data.overview.totalRevenue, 'USDC\n');
  } catch (error) {
    console.error('Stats API error:', error);
  }

  console.log('✅ All examples completed!');
  console.log('💡 Tip: All payments were handled automatically by the SDK');
  console.log('⚡ Zero gas fees thanks to SKALE Network!');
}

// Run examples
main().catch(console.error);
