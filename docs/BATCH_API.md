# Batch API Guide

## 📦 Volume Discounts & Bulk Calls

Execute multiple API calls in a single request and save up to **30% with volume discounts**.

---

## 🎯 Overview

The Batch API allows you to:
- Execute multiple API calls in parallel
- Get volume discounts (10-30% off)
- Reduce network overhead
- Simplify complex workflows

---

## 💰 Pricing Tiers

| Calls | Discount | Savings |
|-------|----------|---------|
| 1-4 | 0% | None |
| 5-9 | 10% | 10% off total |
| 10-19 | 20% | 20% off total |
| 20+ | 30% | 30% off total |

**Maximum:** 100 calls per batch request

---

## 🚀 Quick Start

### Basic Batch Request

```bash
POST /api/batch
Content-Type: application/json
X-PAYMENT: <signature>

{
  "calls": [
    {
      "endpoint": "/api/crypto",
      "params": {"symbol": "BTCUSDT"}
    },
    {
      "endpoint": "/api/weather",
      "params": {"city": "London"}
    },
    {
      "endpoint": "/api/news",
      "params": {"category": "tech"}
    }
  ]
}
```

### Response

```json
{
  "success": true,
  "batch": {
    "results": [
      {
        "endpoint": "/api/crypto",
        "success": true,
        "data": {...},
        "responseTime": 150
      },
      {
        "endpoint": "/api/weather",
        "success": true,
        "data": {...},
        "responseTime": 200
      },
      {
        "endpoint": "/api/news",
        "success": true,
        "data": {...},
        "responseTime": 300
      }
    ],
    "totalCalls": 3,
    "successfulCalls": 3,
    "failedCalls": 0,
    "totalTime": 650,
    "averageTime": 217,
    "pricing": {
      "individualTotal": 0.008,
      "discountPercentage": 0,
      "discountAmount": 0,
      "finalPrice": 0.008,
      "savings": 0,
      "currency": "USDC"
    }
  }
}
```

---

## 📊 Pricing Calculator

### Get Pricing Info (No Payment Required)

```bash
GET /api/batch/pricing?calls=10
```

**Response:**
```json
{
  "callCount": 10,
  "pricing": {
    "individualTotal": 0.01,
    "discountPercentage": 0.2,
    "discountAmount": 0.002,
    "finalPrice": 0.008,
    "savings": 0.002,
    "currency": "USDC"
  },
  "discountTiers": [
    {"calls": "1-4", "discount": "0%"},
    {"calls": "5-9", "discount": "10%"},
    {"calls": "10-19", "discount": "20%"},
    {"calls": "20+", "discount": "30%"}
  ],
  "maxCallsPerBatch": 100
}
```

---

## 💡 Use Cases

### 1. Trading Bot - Multi-Source Data

```json
{
  "calls": [
    {"endpoint": "/api/crypto", "params": {"symbol": "BTCUSDT"}},
    {"endpoint": "/api/coingecko", "params": {"per_page": 5}},
    {"endpoint": "/api/news", "params": {"category": "business"}},
    {"endpoint": "/api/ruby/price", "params": {"token": "SKL"}},
    {"endpoint": "/api/chirper/sentiment", "params": {"topic": "crypto"}}
  ]
}
```

**Pricing:**
- Individual: 0.021 USDC
- With 10% discount: 0.0189 USDC
- **Savings: 0.0021 USDC**

---

### 2. Market Research - SKALE Ecosystem

```json
{
  "calls": [
    {"endpoint": "/api/ruby/price", "params": {"token": "SKL"}},
    {"endpoint": "/api/ruby/price", "params": {"token": "SKILL"}},
    {"endpoint": "/api/ruby/liquidity", "params": {"pool": "SKL-USDC"}},
    {"endpoint": "/api/ruby/pairs", "params": {"limit": 5}},
    {"endpoint": "/api/chirper/trending", "params": {"limit": 10}},
    {"endpoint": "/api/chirper/sentiment", "params": {"topic": "SKALE"}},
    {"endpoint": "/api/gaming/overview"},
    {"endpoint": "/api/gaming/stats", "params": {"game": "cryptoblades"}},
    {"endpoint": "/api/gaming/stats", "params": {"game": "bithotel"}},
    {"endpoint": "/api/gaming/token", "params": {"game": "cryptoblades"}}
  ]
}
```

**Pricing:**
- Individual: 0.024 USDC
- With 20% discount: 0.0192 USDC
- **Savings: 0.0048 USDC**

---

### 3. Comprehensive Dashboard - 20+ Calls

```json
{
  "calls": [
    // Crypto prices (5 calls)
    {"endpoint": "/api/crypto", "params": {"symbol": "BTCUSDT"}},
    {"endpoint": "/api/crypto", "params": {"symbol": "ETHUSDT"}},
    {"endpoint": "/api/coingecko", "params": {"per_page": 10}},
    {"endpoint": "/api/ruby/price", "params": {"token": "SKL"}},
    {"endpoint": "/api/ruby/price", "params": {"token": "SKILL"}},
    
    // Market data (5 calls)
    {"endpoint": "/api/ruby/liquidity", "params": {"pool": "SKL-USDC"}},
    {"endpoint": "/api/ruby/pairs", "params": {"limit": 10}},
    {"endpoint": "/api/exchange/rates", "params": {"base": "USD"}},
    {"endpoint": "/api/news", "params": {"category": "business"}},
    {"endpoint": "/api/news", "params": {"category": "technology"}},
    
    // Social sentiment (5 calls)
    {"endpoint": "/api/chirper/trending", "params": {"limit": 10}},
    {"endpoint": "/api/chirper/sentiment", "params": {"topic": "SKALE"}},
    {"endpoint": "/api/chirper/sentiment", "params": {"topic": "DeFi"}},
    {"endpoint": "/api/reddit", "params": {"subreddit": "cryptocurrency"}},
    {"endpoint": "/api/reddit", "params": {"subreddit": "skale"}},
    
    // Gaming (5 calls)
    {"endpoint": "/api/gaming/overview"},
    {"endpoint": "/api/gaming/stats", "params": {"game": "cryptoblades"}},
    {"endpoint": "/api/gaming/nft", "params": {"game": "cryptoblades"}},
    {"endpoint": "/api/gaming/leaderboard", "params": {"game": "cryptoblades"}},
    {"endpoint": "/api/gaming/token", "params": {"game": "cryptoblades"}},
    
    // Utilities (5 calls)
    {"endpoint": "/api/utilities/hackernews", "params": {"limit": 10}},
    {"endpoint": "/api/github/search", "params": {"query": "blockchain"}},
    {"endpoint": "/api/weather", "params": {"city": "London"}},
    {"endpoint": "/api/exchange/convert", "params": {"amount": 100, "from": "USD", "to": "EUR"}},
    {"endpoint": "/api/chirper/stats"}
  ]
}
```

**Pricing:**
- Individual: ~0.050 USDC
- With 30% discount: 0.035 USDC
- **Savings: 0.015 USDC (30%!)**

---

## 🎯 Best Practices

### 1. Group Related Calls
```json
// Good: Related data in one batch
{
  "calls": [
    {"endpoint": "/api/ruby/price", "params": {"token": "SKL"}},
    {"endpoint": "/api/ruby/liquidity", "params": {"pool": "SKL-USDC"}},
    {"endpoint": "/api/ruby/quote", "params": {"fromToken": "SKL", "toToken": "USDC", "amount": "100"}}
  ]
}
```

### 2. Optimize for Discount Tiers
```json
// Aim for 5+ calls to get 10% discount
// Aim for 10+ calls to get 20% discount
// Aim for 20+ calls to get 30% discount
```

### 3. Handle Partial Failures
```typescript
const response = await batch(calls);

// Check individual results
response.batch.results.forEach(result => {
  if (result.success) {
    processData(result.data);
  } else {
    logError(result.endpoint, result.error);
  }
});

// Overall success rate
console.log(`Success rate: ${response.batch.successfulCalls}/${response.batch.totalCalls}`);
```

---

## ⚡ Performance

### Parallel Execution
All calls in a batch are executed **in parallel**, not sequentially.

**Example:**
- 10 calls, each taking 500ms
- Sequential: 5000ms total
- Batch (parallel): ~500ms total

**Actual Results:**
```json
{
  "totalCalls": 20,
  "totalTime": 587,
  "averageTime": 124
}
```

---

## 🚫 Limitations

1. **Maximum 100 calls** per batch request
2. **10 second timeout** per batch
3. **Same payment header** for all calls in batch
4. **No nested batches** (can't batch a batch)

---

## 💰 Cost Comparison

### Without Batch API

```typescript
// Individual calls
const btc = await api.crypto({ symbol: 'BTCUSDT' });      // 0.002 USDC
const eth = await api.crypto({ symbol: 'ETHUSDT' });      // 0.002 USDC
const weather = await api.weather({ city: 'London' });    // 0.001 USDC
const news = await api.news({ category: 'tech' });        // 0.005 USDC
const skl = await api.ruby.price({ token: 'SKL' });       // 0.001 USDC

// Total: 0.011 USDC
// Time: ~2500ms (sequential)
```

### With Batch API

```typescript
const batch = await api.batch([
  { endpoint: '/api/crypto', params: { symbol: 'BTCUSDT' } },
  { endpoint: '/api/crypto', params: { symbol: 'ETHUSDT' } },
  { endpoint: '/api/weather', params: { city: 'London' } },
  { endpoint: '/api/news', params: { category: 'tech' } },
  { endpoint: '/api/ruby/price', params: { token: 'SKL' } }
]);

// Total: 0.0099 USDC (10% discount)
// Time: ~500ms (parallel)
// Savings: 0.0011 USDC + 80% faster!
```

---

## 🔗 Integration Examples

### TypeScript/JavaScript

```typescript
import { PayPerAgentClient } from '@payperagent/sdk';

const client = new PayPerAgentClient({
  privateKey: process.env.WALLET_KEY
});

// Batch call
const result = await client.batch([
  { endpoint: '/api/crypto', params: { symbol: 'BTCUSDT' } },
  { endpoint: '/api/weather', params: { city: 'London' } },
  { endpoint: '/api/news', params: { category: 'tech' } }
]);

// Access results
const btcPrice = result.batch.results[0].data;
const weather = result.batch.results[1].data;
const news = result.batch.results[2].data;
```

### Python

```python
from payperagent import PayPerAgentClient

client = PayPerAgentClient(private_key=os.getenv('WALLET_KEY'))

# Batch call
result = client.batch([
    {'endpoint': '/api/crypto', 'params': {'symbol': 'BTCUSDT'}},
    {'endpoint': '/api/weather', 'params': {'city': 'London'}},
    {'endpoint': '/api/news', 'params': {'category': 'tech'}}
])

# Access results
btc_price = result['batch']['results'][0]['data']
weather = result['batch']['results'][1]['data']
news = result['batch']['results'][2]['data']
```

---

## 📈 Savings Calculator

| Calls | Individual Price | Batch Price | Savings | Discount |
|-------|-----------------|-------------|---------|----------|
| 5 | 0.010 USDC | 0.009 USDC | 0.001 USDC | 10% |
| 10 | 0.020 USDC | 0.016 USDC | 0.004 USDC | 20% |
| 20 | 0.040 USDC | 0.028 USDC | 0.012 USDC | 30% |
| 50 | 0.100 USDC | 0.070 USDC | 0.030 USDC | 30% |
| 100 | 0.200 USDC | 0.140 USDC | 0.060 USDC | 30% |

---

## 🎉 Summary

**Batch API Benefits:**
- ✅ Save up to 30% on API costs
- ✅ 5-10x faster than sequential calls
- ✅ Simplified code (one request vs many)
- ✅ Reduced network overhead
- ✅ Built-in error handling
- ✅ Automatic discount calculation

**Perfect for:**
- Trading bots needing multi-source data
- Dashboards aggregating multiple APIs
- Research tools analyzing SKALE ecosystem
- Any workflow requiring 5+ API calls

**Start saving today with Batch API! 🚀**
