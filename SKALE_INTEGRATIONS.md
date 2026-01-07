# SKALE Ecosystem Integrations

## 🎯 Overview

PayPerAgent is the **first x402 gateway** to integrate the entire SKALE ecosystem, providing AI agents with access to:
- **Ruby.Exchange** - Decentralized exchange data
- **Chirper.ai** - AI social network sentiment
- **Gaming APIs** - CryptoBlades, BitHotel, and more

All with **zero gas fees** and **micro-transaction pricing**.

---

## 💱 Ruby.Exchange Integration

Ruby.Exchange is the leading DEX on SKALE Network, connecting 19+ SKALE chains.

### **Endpoints**

#### 1. Token Prices
```bash
GET /api/ruby/price?token=SKL&pair=USDC
```

**Price:** 0.001 USDC  
**Response:**
```json
{
  "token": "SKL",
  "pair": "USDC",
  "price": 70.34,
  "volume24h": 171644.96,
  "priceChange24h": -3.56,
  "lastUpdated": "2026-01-07T15:14:16.637Z",
  "source": "Ruby.Exchange"
}
```

**Supported Tokens:**
- SKL (SKALE)
- SKILL (CryptoBlades)
- ETH, WETH
- WBTC, BTC
- USDC, USDT

---

#### 2. Pool Liquidity
```bash
GET /api/ruby/liquidity?pool=SKL-USDC
```

**Price:** 0.002 USDC  
**Response:**
```json
{
  "pool": "SKL-USDC",
  "totalLiquidity": 3373725.83,
  "token0Reserve": 4037073.10,
  "token1Reserve": 3728572.81,
  "volume24h": 726958.97,
  "fees24h": 9005.85,
  "apr": 15.62,
  "lastUpdated": "2026-01-07T15:14:17.528Z"
}
```

---

#### 3. Swap Quotes
```bash
GET /api/ruby/quote?fromToken=SKL&toToken=USDC&amount=100
```

**Price:** 0.001 USDC  
**Response:**
```json
{
  "fromToken": "SKL",
  "toToken": "USDC",
  "amountIn": "100",
  "amountOut": "95.78",
  "priceImpact": "1.67",
  "fee": "0.30",
  "route": ["SKL", "USDC"],
  "estimatedGas": 0
}
```

---

#### 4. Top Trading Pairs
```bash
GET /api/ruby/pairs?limit=5
```

**Price:** 0.001 USDC  
**Response:**
```json
{
  "pairs": [
    {
      "pair": "SKL-USDC",
      "volume24h": 1500000,
      "liquidity": 5000000,
      "apr": 25.5
    },
    {
      "pair": "SKILL-USDC",
      "volume24h": 800000,
      "liquidity": 2500000,
      "apr": 18.2
    }
  ]
}
```

---

## 🤖 Chirper.ai Integration

Chirper.ai is the world's first AI-only social network with 100,000+ AI agents.

### **Endpoints**

#### 1. Trending Topics
```bash
GET /api/chirper/trending?limit=3&timeframe=24h
```

**Price:** 0.003 USDC  
**Response:**
```json
{
  "topics": [
    {
      "topic": "AI Agents",
      "mentions": 15420,
      "sentiment": 0.78,
      "growth": 25.5
    },
    {
      "topic": "SKALE Network",
      "mentions": 8930,
      "sentiment": 0.85,
      "growth": 42.3
    }
  ],
  "timeframe": "24h",
  "totalAgents": 100000,
  "totalChirps": 2500000
}
```

**Timeframes:** `1h`, `24h`, `7d`

---

#### 2. Sentiment Analysis
```bash
GET /api/chirper/sentiment?topic=SKALE&timeframe=24h
```

**Price:** 0.005 USDC  
**Response:**
```json
{
  "topic": "SKALE",
  "timeframe": "24h",
  "sentiment": 0.65,
  "sentimentLabel": "positive",
  "positiveCount": 3249,
  "negativeCount": 692,
  "neutralCount": 1041,
  "totalMentions": 4982,
  "topAgents": [
    {
      "name": "CryptoSage",
      "influence": 95,
      "sentiment": 0.88
    }
  ]
}
```

**Sentiment Labels:**
- `very positive` (0.7+)
- `positive` (0.6-0.7)
- `neutral` (0.4-0.6)
- `negative` (0.3-0.4)
- `very negative` (<0.3)

---

#### 3. Network Statistics
```bash
GET /api/chirper/stats
```

**Price:** 0.002 USDC  
**Response:**
```json
{
  "totalAgents": 100000,
  "activeAgents24h": 45000,
  "totalChirps": 2500000,
  "chirps24h": 125000,
  "uniqueTopics": 15000,
  "averageNetworkSentiment": 0.68,
  "topCategories": [
    {"category": "Technology", "agents": 25000},
    {"category": "Finance", "agents": 18000}
  ]
}
```

---

#### 4. AI Conversations
```bash
GET /api/chirper/conversations?topic=AI&limit=2
```

**Price:** 0.003 USDC  
**Response:**
```json
{
  "topic": "AI",
  "conversations": [
    {
      "id": "conv_123",
      "agents": [
        {"name": "Agent1", "role": "initiator"},
        {"name": "Agent2", "role": "responder"}
      ],
      "chirpCount": 49,
      "sentiment": 0.60,
      "engagement": 326
    }
  ]
}
```

---

## 🎮 Gaming APIs Integration

Access data from SKALE's thriving gaming ecosystem.

### **Supported Games**
- **CryptoBlades** - Play-to-earn combat game
- **BitHotel** - Social gaming metaverse (50k+ DAU)
- **Mystrios** - Play-to-earn RPG
- **MotoDex** - Motorcycle racing
- **5TARS** - Web3 football game

### **Endpoints**

#### 1. Game Statistics
```bash
GET /api/gaming/stats?game=cryptoblades
```

**Price:** 0.002 USDC  
**Response:**
```json
{
  "game": "cryptoblades",
  "players": 77042,
  "activeUsers24h": 23442,
  "totalTransactions": 8051115,
  "volume24h": 253480,
  "tokenPrice": 0.4707,
  "nftFloorPrice": 9.63,
  "averageSessionTime": "53 minutes"
}
```

---

#### 2. NFT Prices
```bash
GET /api/gaming/nft?game=cryptoblades&collection=Weapons
```

**Price:** 0.003 USDC  
**Response:**
```json
{
  "game": "cryptoblades",
  "collection": "Weapons",
  "collections": [
    {
      "name": "Weapons",
      "floorPrice": 3.71,
      "averagePrice": 7.39,
      "volume24h": 35013,
      "sales24h": 226,
      "totalSupply": 6402
    }
  ],
  "topSales": [
    {
      "tokenId": "#1234",
      "price": 15.5,
      "buyer": "0x123..."
    }
  ]
}
```

---

#### 3. Leaderboards
```bash
GET /api/gaming/leaderboard?game=cryptoblades&limit=3
```

**Price:** 0.002 USDC  
**Response:**
```json
{
  "game": "cryptoblades",
  "leaderboard": [
    {
      "rank": 1,
      "player": "Player1",
      "address": "0x69dfb63e90085",
      "score": 96568,
      "wins": 488,
      "losses": 100,
      "earnings": 977.61,
      "level": 50
    }
  ],
  "totalPlayers": 50000
}
```

---

#### 4. Game Token Prices
```bash
GET /api/gaming/token?game=cryptoblades
```

**Price:** 0.001 USDC  
**Response:**
```json
{
  "game": "cryptoblades",
  "token": "SKILL",
  "price": 0.5455,
  "priceChange24h": -9.16,
  "volume24h": 68705,
  "marketCap": 7944155,
  "circulatingSupply": 72954765
}
```

**Supported Tokens:**
- SKILL (CryptoBlades)
- BTH (BitHotel)
- MYS (Mystrios)

---

#### 5. All Games Overview
```bash
GET /api/gaming/overview
```

**Price:** 0.004 USDC  
**Response:**
```json
{
  "totalGames": 5,
  "games": [
    {
      "game": "cryptoblades",
      "players": 29794,
      "activeUsers24h": 49770,
      "tokenPrice": 0.7765
    }
  ],
  "totalPlayers": 204285,
  "totalActiveUsers": 134927
}
```

---

## 📦 Batch API Calls

Execute multiple SKALE ecosystem calls in one request with volume discounts.

### **Example: Multi-Source Data Aggregation**

```bash
POST /api/batch
Content-Type: application/json
X-PAYMENT: <signature>

{
  "calls": [
    {"endpoint": "/api/ruby/price", "params": {"token": "SKL"}},
    {"endpoint": "/api/ruby/price", "params": {"token": "SKILL"}},
    {"endpoint": "/api/chirper/sentiment", "params": {"topic": "SKALE"}},
    {"endpoint": "/api/gaming/stats", "params": {"game": "cryptoblades"}},
    {"endpoint": "/api/gaming/token", "params": {"game": "cryptoblades"}}
  ]
}
```

**Response:**
```json
{
  "success": true,
  "batch": {
    "results": [...],
    "totalCalls": 5,
    "successfulCalls": 5,
    "failedCalls": 0,
    "totalTime": 640,
    "averageTime": 128,
    "pricing": {
      "individualTotal": 0.012,
      "discountPercentage": 0.1,
      "finalPrice": 0.0108,
      "savings": 0.0012
    }
  }
}
```

**Discount Tiers:**
- 5-9 calls: 10% off
- 10-19 calls: 20% off
- 20+ calls: 30% off

---

## 🎯 Use Cases

### **1. Trading Bots**
```typescript
// Get DEX prices + sentiment in one call
const data = await batch([
  { endpoint: '/api/ruby/price', params: { token: 'SKL' } },
  { endpoint: '/api/chirper/sentiment', params: { topic: 'SKALE' } }
]);

if (data.sentiment > 0.7 && data.price < targetPrice) {
  executeTrade();
}
```

### **2. Gaming Analytics**
```typescript
// Track multiple games
const overview = await gaming.overview();
const topGame = overview.games.sort((a, b) => 
  b.activeUsers24h - a.activeUsers24h
)[0];
```

### **3. Market Research**
```typescript
// Analyze SKALE ecosystem sentiment
const sentiment = await chirper.sentiment({ topic: 'SKALE' });
const trending = await chirper.trending({ limit: 10 });
```

---

## 🔗 Integration Partners

### **Ruby.Exchange**
- Website: https://ruby.exchange
- Docs: https://docs.ruby.exchange
- Status: Mock data (ready for API integration)

### **Chirper.ai**
- Website: https://chirper.ai
- Stats: 100k AI agents, 2.5M monthly chirps
- Status: Mock data (ready for API integration)

### **Gaming Projects**
- CryptoBlades: https://cryptoblades.io
- BitHotel: https://bithotel.io
- Status: Mock data (ready for API integration)

---

## 📈 Pricing Summary

| Category | Endpoints | Price Range | Total |
|----------|-----------|-------------|-------|
| Ruby.Exchange | 4 | 0.001-0.002 USDC | 0.005 USDC |
| Chirper.ai | 4 | 0.002-0.005 USDC | 0.013 USDC |
| Gaming | 5 | 0.001-0.004 USDC | 0.012 USDC |
| **Total** | **13** | **0.001-0.005 USDC** | **0.030 USDC** |

**With 30% batch discount:** 0.021 USDC for all 13 endpoints!

---

## 🚀 Why This Matters

**PayPerAgent is the ONLY x402 gateway with:**
1. ✅ Native SKALE ecosystem integration
2. ✅ DEX data for trading agents
3. ✅ AI sentiment from 100k agents
4. ✅ Gaming data for NFT/token bots
5. ✅ Batch discounts for efficiency (10-30% off)
6. ✅ Agent reputation system (up to 20% loyalty discount)
7. ✅ Multi-token payments (USDC, USDT, SKL, WETH)
8. ✅ Zero gas fees on all calls

**We're not just using SKALE - we're building the infrastructure layer for SKALE agents.**

---

## 🏆 Agent Reputation System

Build your reputation and earn loyalty discounts on top of batch discounts!

### **Reputation Tiers**

| Tier | Requests | Success Rate | Discount | Color |
|------|----------|--------------|----------|-------|
| 🥉 Bronze | 0+ | Any | 0% | #CD7F32 |
| 🥈 Silver | 100+ | 85%+ | 5% | #C0C0C0 |
| 🥇 Gold | 500+ | 90%+ | 10% | #FFD700 |
| 💎 Platinum | 2,000+ | 95%+ | 15% | #E5E4E2 |
| 💠 Diamond | 10,000+ | 98%+ | 20% | #B9F2FF |

### **How It Works**

1. **Track Your Progress**: Every API call is tracked
2. **Maintain Quality**: Keep your success rate high
3. **Earn Discounts**: Automatic tier upgrades
4. **Stack Savings**: Combine with batch discounts!

### **Example Savings**

**Scenario**: Diamond tier agent making 20 batch calls

- Base price: 0.020 USDC
- Batch discount (30%): -0.006 USDC
- Reputation discount (20%): -0.0028 USDC
- **Final price: 0.0112 USDC**
- **Total savings: 44%!**

### **Reputation Endpoints**

```bash
# Get your reputation
GET /api/reputation/agent/:address

# View leaderboard
GET /api/reputation/leaderboard?limit=10

# Check tier requirements
GET /api/reputation/tiers

# Get detailed stats
GET /api/reputation/stats?address=0x...
```

---

## 💰 Multi-Token Payment Support

Pay with your preferred token - automatic conversion to USDC pricing.

### **Supported Tokens**

| Token | Network | Decimals | Example Rate |
|-------|---------|----------|--------------|
| USDC | SKALE | 6 | 1.0 (base) |
| USDT | SKALE | 6 | 1.0 |
| SKL | SKALE | 18 | 0.05 |
| WETH | SKALE | 18 | 3000.0 |

### **How to Use**

Add payment token headers to your request:

```bash
curl -H "X-PAYMENT: <signature>" \
     -H "X-PAYMENT-TOKEN: SKL" \
     -H "X-PAYMENT-AMOUNT: 0.02" \
     "http://localhost:3000/api/ruby/price?token=SKL"
```

**Automatic Conversion**: 
- 0.02 SKL × 0.05 = 0.001 USDC equivalent
- Pricing calculated in USDC, payment accepted in any token

### **Get Token Info**

```bash
GET /api/reputation/tokens
```

**Response:**
```json
{
  "success": true,
  "tokens": [
    {
      "symbol": "USDC",
      "decimals": 6,
      "network": "skale-base-sepolia",
      "conversionRate": 1.0
    },
    {
      "symbol": "SKL",
      "decimals": 18,
      "network": "skale-base-sepolia",
      "conversionRate": 0.05
    }
  ]
}
```
