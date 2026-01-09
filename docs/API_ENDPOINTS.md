# PayPerAgent API Endpoints

## 📊 Complete API Reference

**Total Endpoints:** 29  
**Total APIs:** 16  
**SKALE Ecosystem:** 13 endpoints

### Base URL
```
https://payperagent.xyz
```

---

## 🌤️ Weather APIs

### 1. OpenWeatherMap
**Endpoint:** `GET /api/weather`  
**Price:** 0.001 USDC  
**Parameters:**
- `city` (string) - City name OR
- `lat` (number) - Latitude
- `lon` (number) - Longitude

**Example:**
```bash
curl -H "X-PAYMENT: <signature>" "https://payperagent.xyz/api/weather?city=London"
```

---

## 💰 Cryptocurrency APIs

### 2. Binance
**Endpoint:** `GET /api/crypto`  
**Price:** 0.002 USDC  
**Parameters:**
- `symbol` (string) - Trading pair (e.g., BTCUSDT) OR
- `symbols` (string) - Comma-separated pairs

**Example:**
```bash
curl -H "X-PAYMENT: <signature>" "https://payperagent.xyz/api/crypto?symbol=BTCUSDT"
```

### 3. CoinGecko Markets
**Endpoint:** `GET /api/coingecko`  
**Price:** 0.001 USDC  
**Parameters:**
- `vs_currency` (string, default: usd)
- `ids` (string) - Comma-separated coin IDs
- `per_page` (number, default: 10)
- `page` (number, default: 1)

**Example:**
```bash
curl -H "X-PAYMENT: <signature>" "https://payperagent.xyz/api/coingecko?vs_currency=usd&per_page=10"
```

### 4. CoinGecko Price
**Endpoint:** `GET /api/coingecko/price/:coinId`  
**Price:** 0.001 USDC  
**Parameters:**
- `vs_currency` (string, default: usd)

**Example:**
```bash
curl -H "X-PAYMENT: <signature>" "https://payperagent.xyz/api/coingecko/price/bitcoin?vs_currency=usd"
```

---

## 📰 News APIs

### 5. NewsAPI
**Endpoint:** `GET /api/news`  
**Price:** 0.005 USDC  
**Parameters:**
- `query` (string) - Search query OR
- `category` (string) - business, entertainment, general, health, science, sports, technology
- `country` (string) - Country code (e.g., us)
- `pageSize` (number, 1-100)

**Example:**
```bash
curl -H "X-PAYMENT: <signature>" "https://payperagent.xyz/api/news?category=technology&pageSize=5"
```

---

## 📚 Knowledge APIs

### 6. Wikipedia Search
**Endpoint:** `GET /api/wikipedia/search`  
**Price:** 0.002 USDC  
**Parameters:**
- `query` (string, required) - Search query
- `limit` (number, default: 5)

**Example:**
```bash
curl -H "X-PAYMENT: <signature>" "https://payperagent.xyz/api/wikipedia/search?query=SKALE+Network&limit=5"
```

### 7. Wikipedia Page
**Endpoint:** `GET /api/wikipedia/page`  
**Price:** 0.002 USDC  
**Parameters:**
- `title` (string, required) - Page title

**Example:**
```bash
curl -H "X-PAYMENT: <signature>" "https://payperagent.xyz/api/wikipedia/page?title=Blockchain"
```

---

## 🗨️ Social Media APIs

### 8. Reddit
**Endpoint:** `GET /api/reddit`  
**Price:** 0.002 USDC  
**Parameters:**
- `subreddit` (string, required) - Subreddit name
- `sort` (string) - hot, new, top, rising (default: hot)
- `time` (string) - hour, day, week, month, year, all (default: day)
- `limit` (number, default: 10)

**Example:**
```bash
curl -H "X-PAYMENT: <signature>" "https://payperagent.xyz/api/reddit?subreddit=programming&sort=hot&limit=10"
```

### 9. HackerNews
**Endpoint:** `GET /api/utilities/hackernews`  
**Price:** 0.001 USDC  
**Parameters:**
- `limit` (number, default: 10)

**Example:**
```bash
curl -H "X-PAYMENT: <signature>" "https://payperagent.xyz/api/utilities/hackernews?limit=10"
```

---

## 💻 Developer APIs

### 10. GitHub Repository Search
**Endpoint:** `GET /api/github/search`  
**Price:** 0.003 USDC  
**Parameters:**
- `query` (string, required) - Search query
- `sort` (string) - stars, forks, updated (default: stars)
- `order` (string) - desc, asc (default: desc)
- `per_page` (number, default: 10)

**Example:**
```bash
curl -H "X-PAYMENT: <signature>" "https://payperagent.xyz/api/github/search?query=react&sort=stars"
```

### 11. GitHub User
**Endpoint:** `GET /api/github/user/:username`  
**Price:** 0.003 USDC  

**Example:**
```bash
curl -H "X-PAYMENT: <signature>" "https://payperagent.xyz/api/github/user/torvalds"
```

---

## 💱 Financial APIs

### 12. Exchange Rates
**Endpoint:** `GET /api/exchange/rates`  
**Price:** 0.001 USDC  
**Parameters:**
- `base` (string, default: USD) - Base currency
- `symbols` (string) - Comma-separated currency codes

**Example:**
```bash
curl -H "X-PAYMENT: <signature>" "https://payperagent.xyz/api/exchange/rates?base=USD&symbols=EUR,GBP,JPY"
```

### 13. Currency Conversion
**Endpoint:** `GET /api/exchange/convert`  
**Price:** 0.001 USDC  
**Parameters:**
- `amount` (number, required) - Amount to convert
- `from` (string, required) - Source currency
- `to` (string, required) - Target currency

**Example:**
```bash
curl -H "X-PAYMENT: <signature>" "https://payperagent.xyz/api/exchange/convert?amount=100&from=USD&to=EUR"
```

---

## 🛠️ Utility APIs

### 14. IP Geolocation
**Endpoint:** `GET /api/utilities/ip`  
**Price:** 0.001 USDC  
**Parameters:**
- `ip` (string, optional) - IP address (defaults to requester's IP)

**Example:**
```bash
curl -H "X-PAYMENT: <signature>" "https://payperagent.xyz/api/utilities/ip?ip=8.8.8.8"
```

### 15. QR Code Generator
**Endpoint:** `GET /api/utilities/qr`  
**Price:** 0.0005 USDC  
**Parameters:**
- `text` (string, required) - Text to encode
- `size` (number, default: 200) - QR code size in pixels

**Example:**
```bash
curl -H "X-PAYMENT: <signature>" "https://payperagent.xyz/api/utilities/qr?text=https://skale.space&size=300"
```

### 16. Public Holidays
**Endpoint:** `GET /api/utilities/holidays`  
**Price:** 0.0005 USDC  
**Parameters:**
- `year` (number, required) - Year
- `country` (string, required) - Country code (e.g., US, GB, FR)

**Example:**
```bash
curl -H "X-PAYMENT: <signature>" "https://payperagent.xyz/api/utilities/holidays?year=2024&country=US"
```

### 17. Random Dog
**Endpoint:** `GET /api/utilities/random/dog`  
**Price:** 0.0005 USDC  

**Example:**
```bash
curl -H "X-PAYMENT: <signature>" "https://payperagent.xyz/api/utilities/random/dog"
```

### 18. Random Cat
**Endpoint:** `GET /api/utilities/random/cat`  
**Price:** 0.0005 USDC  

**Example:**
```bash
curl -H "X-PAYMENT: <signature>" "https://payperagent.xyz/api/utilities/random/cat"
```

---

## 📊 System APIs

### Health Check
**Endpoint:** `GET /health`  
**Price:** FREE  

**Example:**
```bash
curl "https://payperagent.xyz/health"
```

### Gateway Info
**Endpoint:** `GET /api`  
**Price:** FREE  

**Example:**
```bash
curl "https://payperagent.xyz/api"
```

### Analytics
**Endpoint:** `GET /analytics/usage`  
**Price:** FREE  

**Example:**
```bash
curl "https://payperagent.xyz/analytics/usage"
```

### Cache Stats
**Endpoint:** `GET /cache/stats`  
**Price:** FREE  

**Example:**
```bash
curl "https://payperagent.xyz/cache/stats"
```

---

## 💰 Pricing Summary

| API | Price (USDC) | Category |
|-----|--------------|----------|
| Weather | 0.001 | Data |
| Crypto (Binance) | 0.002 | Finance |
| News | 0.005 | Media |
| CoinGecko | 0.001 | Finance |
| Wikipedia | 0.002 | Knowledge |
| Reddit | 0.002 | Social |
| GitHub | 0.003 | Developer |
| Exchange | 0.001 | Finance |
| IP Lookup | 0.001 | Utility |
| QR Code | 0.0005 | Utility |
| Holidays | 0.0005 | Utility |
| HackerNews | 0.001 | Tech News |
| Random Dog | 0.0005 | Fun |
| Random Cat | 0.0005 | Fun |

**Total APIs:** 14 FREE services (27 endpoints)  
**Price Range:** 0.0005 - 0.005 USDC  
**Average Price:** 0.002 USDC

---

## 🏆 Reputation & Analytics APIs

### Agent Reputation
**Endpoint:** `GET /api/reputation/agent/:address`  
**Price:** Free  
**Description:** Get agent reputation, tier, and statistics

**Example:**
```bash
curl "https://payperagent.xyz/api/reputation/agent/0x123..."
```

**Response:**
```json
{
  "success": true,
  "reputation": {
    "walletAddress": "0x123...",
    "totalRequests": 1250,
    "successfulRequests": 1200,
    "successRate": 0.96,
    "tier": "platinum",
    "discount": 0.15,
    "totalSpent": "2.5 USDC",
    "favoriteEndpoints": [
      {"endpoint": "/api/crypto", "count": 450},
      {"endpoint": "/api/ruby/price", "count": 320}
    ]
  }
}
```

---

### Leaderboard
**Endpoint:** `GET /api/reputation/leaderboard`  
**Price:** Free  
**Parameters:**
- `limit` (number) - Max results (default: 10, max: 100)

**Example:**
```bash
curl "https://payperagent.xyz/api/reputation/leaderboard?limit=5"
```

---

### Reputation Tiers
**Endpoint:** `GET /api/reputation/tiers`  
**Price:** Free  
**Description:** Get all reputation tier requirements and benefits

**Response:**
```json
{
  "success": true,
  "tiers": [
    {
      "tier": "bronze",
      "name": "Bronze",
      "minRequests": 0,
      "minSuccessRate": 0,
      "discount": 0
    },
    {
      "tier": "diamond",
      "name": "Diamond",
      "minRequests": 10000,
      "minSuccessRate": 0.98,
      "discount": 0.20
    }
  ]
}
```

---

### Agent Statistics
**Endpoint:** `GET /api/reputation/stats`  
**Price:** Free  
**Parameters:**
- `address` (string) - Wallet address

**Description:** Detailed stats including progress to next tier

---

### Supported Payment Tokens
**Endpoint:** `GET /api/reputation/tokens`  
**Price:** Free  
**Description:** Get list of supported payment tokens with conversion rates

**Response:**
```json
{
  "success": true,
  "tokens": [
    {"symbol": "USDC", "decimals": 6, "conversionRate": 1.0},
    {"symbol": "USDT", "decimals": 6, "conversionRate": 1.0},
    {"symbol": "SKL", "decimals": 18, "conversionRate": 0.05},
    {"symbol": "WETH", "decimals": 18, "conversionRate": 3000.0}
  ]
}
```

---

## 💰 Multi-Token Payments

**How to Use:**

Add these headers to any API request:
```bash
curl -H "X-PAYMENT: <signature>" \
     -H "X-PAYMENT-TOKEN: SKL" \
     -H "X-PAYMENT-AMOUNT: 0.02" \
     "https://payperagent.xyz/api/crypto?symbol=BTCUSDT"
```

**Supported Tokens:**
- USDC (1:1 with pricing)
- USDT (1:1 with pricing)
- SKL (example: 0.05 USDC per SKL)
- WETH (example: 3000 USDC per WETH)

**Automatic Conversion:**
All prices are in USDC. When paying with alternative tokens, the amount is automatically converted.

---

## 📊 Discount Stacking

**Combine multiple discounts for maximum savings!**

### Example: Diamond Tier + 20-Call Batch

1. **Base Price**: 20 calls × 0.001 USDC = 0.020 USDC
2. **Batch Discount (30%)**: -0.006 USDC
3. **Reputation Discount (20%)**: -0.0028 USDC
4. **Final Price**: 0.0112 USDC
5. **Total Savings**: 44%!

### Discount Tiers

**Batch Discounts:**
- 5-9 calls: 10% off
- 10-19 calls: 20% off
- 20+ calls: 30% off

**Reputation Discounts:**
- Bronze: 0% (0+ requests)
- Silver: 5% (100+ requests, 85%+ success)
- Gold: 10% (500+ requests, 90%+ success)
- Platinum: 15% (2000+ requests, 95%+ success)
- Diamond: 20% (10000+ requests, 98%+ success)

---
