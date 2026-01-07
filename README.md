# PayPerAgent 🚀

**Zero Gas Fee API Gateway for AI Agents on SKALE Network**

PayPerAgent enables AI agents to discover and pay for premium APIs using SKALE's zero-gas x402 payment protocol. Pay only for what you use - no subscriptions, no gas fees, just micro-transactions.

## 🎯 Vision

Building the infrastructure for the Internet of Agents - where AI agents can autonomously access data, pay for services, and transact with each other without gas fees.

## ✨ Features

### ✅ **29 Live Endpoints Across 16 APIs** (Production Ready!)

#### **Original APIs**
- 🌤️ **Weather** - OpenWeatherMap data (0.001 USDC)
- 💰 **Crypto** - Binance real-time prices (0.002 USDC)
- 📰 **News** - NewsAPI headlines (0.005 USDC)

#### **Free APIs** (No Auth Required)
- 📊 **CoinGecko** - Crypto market data (0.001 USDC)
- 📚 **Wikipedia** - Search & articles (0.002 USDC)
- 🗨️ **Reddit** - Subreddit posts (0.002 USDC)
- 💻 **GitHub** - Repo search & users (0.003 USDC)
- 💱 **Exchange** - Currency rates (0.001 USDC)
- 🌍 **IP Lookup** - Geolocation (0.001 USDC)
- 📱 **QR Generator** - Create QR codes (0.0005 USDC)
- 🎉 **Holidays** - Public holidays (0.0005 USDC)
- 🔥 **HackerNews** - Top stories (0.001 USDC)
- 🐕 **Random Dog** - Dog images (0.0005 USDC)
- 🐱 **Random Cat** - Cat images (0.0005 USDC)

#### **Premium AI APIs** (Require API Key)
- 🔍 **Perplexity** - AI web search (0.010 USDC)
- 🤖 **XAI/Grok** - xAI assistant (0.008 USDC)

#### **🔥 SKALE Ecosystem Integrations** (NEW!)
- 💱 **Ruby.Exchange** - DEX prices, liquidity, swap quotes (0.001-0.002 USDC)
- 🤖 **Chirper.ai** - AI sentiment, trending topics, agent stats (0.002-0.005 USDC)
- 🎮 **Gaming APIs** - CryptoBlades, BitHotel stats, NFT prices, leaderboards (0.001-0.004 USDC)

#### **📦 Advanced Features**
- ⚡ **Batch API Calls** - Execute multiple calls with volume discounts (10-30% off)
- 💰 **Multi-Token Support** - Pay with USDC, USDT, SKL, or WETH
- 🏆 **Agent Reputation** - Loyalty tiers with up to 20% additional discounts

### 🎯 **Core Features**
- ✅ **Zero Gas Fees** - SKALE Network integration
- ✅ **x402 Protocol** - HTTP payment verification
- ✅ **Micro-Transactions** - Pay per request (0.0005-0.010 USDC)
- ✅ **Multi-Token Support** - Pay with USDC, USDT, SKL, or WETH
- ✅ **Batch Discounts** - Save up to 30% on bulk API calls
- ✅ **Agent Reputation** - Earn up to 20% loyalty discounts (Bronze→Diamond tiers)
- ✅ **Performance Monitoring** - Real-time metrics & analytics
- ✅ **PostgreSQL** - Persistent caching & analytics
- ✅ **Rate Limiting** - 100/min, 1000/day per agent
- ✅ **Beautiful Console** - Color-coded logging with ASCII art
- ✅ **Enhanced Error Handling** - Comprehensive error classes & logging
- ✅ **Input Validation** - Helpful error messages
- ✅ **Response Compression** - Gzip for performance
- ✅ **Health Monitoring** - Detailed system metrics
- ✅ **SKALE Ecosystem** - First gateway with native SKALE integrations

## 🛠️ Tech Stack

- **Backend:** Node.js, Express, TypeScript
- **Blockchain:** SKALE Network (Nebula Testnet - Chain ID: 37084624)
- **Payments:** x402 protocol via @faremeter/middleware
- **Database:** PostgreSQL with connection pooling
- **Caching:** Dual-layer (Memory + PostgreSQL)
- **APIs:** 29 endpoints across 16 services
  - 3 Original APIs
  - 11 Free APIs (no auth)
  - 2 Premium AI APIs
  - 13 SKALE Ecosystem endpoints (Ruby.Exchange, Chirper.ai, Gaming)
- **Batch System:** Volume discounts (10-30% off)
- **Reputation System:** 5-tier loyalty program (Bronze to Diamond)
  - Bronze: 0% discount (0+ requests)
  - Silver: 5% discount (100+ requests, 85%+ success)
  - Gold: 10% discount (500+ requests, 90%+ success)
  - Platinum: 15% discount (2000+ requests, 95%+ success)
  - Diamond: 20% discount (10000+ requests, 98%+ success)
- **Multi-Token Payments:** USDC, USDT, SKL, WETH with automatic conversion
- **Performance Tracking:** Sub-200ms average response time with detailed metrics
- **SDKs:** TypeScript & Python clients (coming soon)

## Project Structure

```
payperagent/
├── backend/           # API Gateway server
├── frontend/          # Marketplace UI
├── contracts/         # Smart contracts (optional)
├── docs/             # Documentation
└── examples/         # Sample AI agents
```

## Quick Start

See [docs/QUICKSTART.md](docs/QUICKSTART.md) for detailed setup instructions.

## Roadmap

### ✅ Completed
- ✅ Core gateway with x402 payments
- ✅ 16 API integrations (29 endpoints)
- ✅ SKALE ecosystem integration (Ruby.Exchange, Chirper.ai, Gaming)
- ✅ Batch payment system with volume discounts (10-30% off)
- ✅ Agent reputation system with 5 loyalty tiers (up to 20% off)
- ✅ Multi-token payment support (USDC, USDT, SKL, WETH)
- ✅ Performance monitoring middleware with real-time metrics
- ✅ Enhanced error handling with custom error classes
- ✅ PostgreSQL caching & analytics
- ✅ Comprehensive testing (100% success rate)

### 🔄 In Progress
- 🔄 TypeScript & Python SDKs
- 🔄 Production deployment
- 🔄 WebSocket support for real-time updates
- 🔄 API key management system

### 📋 Upcoming
- 📋 Marketplace UI
- 📋 Privacy mode (BITE-inspired)
- 📋 Additional SKALE ecosystem integrations
- 📋 SKALE grant application

## License

MIT

## Documentation

- [Quick Start Guide](docs/QUICKSTART.md)
- [API Endpoints Reference](API_ENDPOINTS.md) - Complete API documentation
- [SKALE Integrations](SKALE_INTEGRATIONS.md) - Ruby.Exchange, Chirper.ai, Gaming APIs
- [Batch API Guide](docs/BATCH_API.md) - Volume discounts & bulk calls
- [Integration Guide](docs/INTEGRATION.md)
- [Architecture Overview](docs/ARCHITECTURE.md)
- [Project Status](docs/STATUS.md)

## Links

- [SKALE Documentation](https://docs.skale.space)
- [x402 Protocol](https://docs.skale.space/cookbook/x402/become-an-x402-seller)
