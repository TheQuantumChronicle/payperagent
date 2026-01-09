# PayPerAgent 🚀

**v1.0.0 - Production Ready**

**Zero Gas Fee API Gateway for AI Agents on SKALE Network**

🌐 **Live at [payperagent.xyz](https://payperagent.xyz)**

PayPerAgent enables AI agents to discover and pay for premium APIs using SKALE's zero-gas x402 payment protocol. Pay only for what you use - no subscriptions, no gas fees, just micro-transactions.

**✅ Production Status:** 98.9% success rate | 17/17 tests passing | 20+ hours uptime

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
- ✅ **x402 Protocol** - HTTP payment verification with recipient & token fields
- ✅ **Coinbase AgentKit Compatible** - Official x402 implementation support
- ✅ **LangChain Integration** - One-line integration for AI agents
- ✅ **Micro-Transactions** - Pay per request (0.0005-0.010 USDC)
- ✅ **Multi-Token Support** - Pay with USDC, USDT, SKL, or WETH
- ✅ **Batch Discounts** - Save up to 30% on bulk API calls
- ✅ **Agent Reputation** - Earn up to 20% loyalty discounts (Bronze→Diamond tiers)
- ✅ **Circuit Breakers** - Automatic failure detection & recovery for 8 external services
- ✅ **Performance Monitoring** - Real-time metrics, P50/P95/P99 latency tracking
- ✅ **WebSocket Support** - Live crypto prices & system metrics updates
- ✅ **PostgreSQL** - Persistent caching & analytics
- ✅ **Rate Limiting** - 100/min, 1000/day per agent
- ✅ **Beautiful Console** - Color-coded logging with ASCII art
- ✅ **Enhanced Error Handling** - Correlation IDs, timestamps, structured errors
- ✅ **Request Validation** - Schema-based input validation
- ✅ **Response Compression** - Gzip for performance
- ✅ **Response Time Headers** - X-Response-Time tracking for debugging
- ✅ **API Versioning** - X-API-Version headers for future compatibility
- ✅ **CORS Preflight Caching** - 24-hour cache for OPTIONS requests
- ✅ **Health Monitoring** - Circuit breaker status, memory usage, dependency checks
- ✅ **API Documentation** - Interactive Swagger UI at `/docs`
- ✅ **System Management** - Circuit breaker controls, performance stats, metrics
- ✅ **SKALE Ecosystem** - Deep integration with 4 SKALE Hubs (Europa, Nebula, Calypso, Chirper)
- ✅ **Analytics Dashboard** - Real-time network activity and agent leaderboard
- ✅ **Automated Testing** - Comprehensive test suite with 17 production tests

## 🛠️ Tech Stack

- **Backend:** Node.js, Express, TypeScript
- **Blockchain:** SKALE Network (Nebula Testnet - Chain ID: 37084624)
- **Payments:** x402 protocol via @faremeter/middleware
- **Database:** PostgreSQL with connection pooling
- **Caching:** Dual-layer (Memory + PostgreSQL) with intelligent TTL optimization
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
- **Resilience:** Circuit breaker pattern protecting 8 external services
- **Real-time:** WebSocket server for live updates (crypto prices, system metrics)
- **Monitoring:** Performance metrics, P50/P95/P99 latency, error rates
- **Documentation:** Interactive Swagger/OpenAPI UI
- **Performance Tracking:** Sub-10ms average response time with detailed metrics
- **SDKs:** TypeScript & Python clients, LangChain integration
- **Agent Frameworks:** Compatible with LangChain, AutoGPT, CrewAI, AutoGen, Semantic Kernel
- **Coinbase AgentKit:** Official x402 protocol support with AgentKit middleware

## 🚀 New Backend Features

### System Management Endpoints
- **GET /system/circuit-breakers** - View status of all circuit breakers
- **POST /system/circuit-breakers/:name/reset** - Reset a specific circuit breaker
- **GET /system/metrics** - System performance metrics (CPU, memory, uptime)
- **GET /system/performance** - API performance statistics (P50/P95/P99, error rates)
- **GET /system/environment** - Environment configuration and feature flags

### Real-time Updates
- **WebSocket /ws** - Real-time crypto prices and system metrics
  - Subscribe to channels: `crypto`, `system`, `events`
  - Live price updates every 5 seconds
  - System metrics every 10 seconds

### Enhanced Monitoring
- **Circuit Breakers**: Automatic failure detection for all external APIs
- **Performance Tracking**: Request latency, throughput, error rates
- **Health Checks**: Comprehensive dependency monitoring
- **API Documentation**: Interactive Swagger UI at `/docs`

## Project Structure

```
payperagent/
├── backend/           # API Gateway server
│   ├── src/
│   │   ├── routes/           # API endpoints
│   │   ├── services/         # Business logic
│   │   ├── middleware/       # Request processing
│   │   ├── utils/            # Utilities (errors, circuit breakers, validation)
│   │   ├── websocket/        # WebSocket server
│   │   ├── integrations/     # AgentKit, external integrations
│   │   ├── database/         # PostgreSQL integration
│   │   └── tests/            # Test suite (API, DB, WebSocket, SKALE)
├── frontend/          # Marketplace UI (React + Vite)
│   ├── src/
│   │   ├── components/       # React components (Analytics, Leaderboard, SKALE Ecosystem)
│   │   └── contexts/         # WebSocket context
├── sdk/              # Client SDKs
│   ├── typescript/           # TypeScript SDK
│   └── langchain/            # LangChain integration
├── contracts/         # Smart contracts (optional)
├── docs/             # Documentation
└── examples/         # Sample AI agents (LangChain, demo agents)
```

## Quick Start

### Production API
```bash
# Test the live API
curl https://payperagent.xyz/health

# Get API info and pricing
curl https://payperagent.xyz/api

# Test payment flow (get 402 with payment details)
curl https://payperagent.xyz/api/weather?city=London

# Make paid request (requires wallet & signature)
curl -H "X-PAYMENT: <payment_json>" "https://payperagent.xyz/api/crypto?symbol=BTCUSDT"
```

### Using the SDK
```typescript
import { createClient } from '@payperagent/sdk';
import { ethers } from 'ethers';

const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!);
const client = createClient({
  gatewayUrl: 'https://payperagent.xyz',
  wallet,
  autoRetry: true // Automatically handle 402 payments
});

// SDK handles payment signing automatically!
const weather = await client.getWeather({ city: 'London' });
console.log(weather);
```

### Run Tests
```bash
# Test all production endpoints
./test-production.sh

# Test with real payments (requires test wallet)
npx tsx test-real-payments.ts
```

### Documentation
- 🌐 **Live API**: [payperagent.xyz](https://payperagent.xyz)
- 🚀 **Quick Start**: [docs/QUICKSTART.md](docs/QUICKSTART.md)
- 🚢 **Production Deployment**: [docs/PRODUCTION.md](docs/PRODUCTION.md)
- 🔗 **SKALE Networks**: [docs/SKALE_NETWORKS.md](docs/SKALE_NETWORKS.md)
- 📚 **API Reference**: [docs/API_ENDPOINTS.md](docs/API_ENDPOINTS.md)
- 📖 **Full Documentation**: [docs/](docs/)

## Roadmap

### ✅ v1.0.0 Release (January 2026)
- ✅ Core gateway with x402 payments
- ✅ 16 API integrations (29 endpoints)
- ✅ Coinbase AgentKit compatibility
- ✅ LangChain SDK and integration examples
- ✅ SKALE ecosystem dashboard (4 hubs, 15+ dApps)
- ✅ Real-time analytics and agent leaderboard
- ✅ WebSocket support with live updates
- ✅ Circuit breakers and performance monitoring
- ✅ Interactive API documentation (Swagger)
- ✅ SKALE ecosystem integration (Ruby.Exchange, Chirper.ai, Gaming)
- ✅ Batch payment system with volume discounts (10-30% off)
- ✅ Agent reputation system with 5 loyalty tiers (up to 20% off)
- ✅ Multi-token payment support (USDC, USDT, SKL, WETH)
- ✅ Circuit breaker pattern for external API resilience
- ✅ Performance monitoring with P50/P95/P99 latency tracking
- ✅ WebSocket server for real-time updates (crypto, system metrics)
- ✅ Enhanced error handling with correlation IDs and timestamps
- ✅ Request validation with schema-based validation
- ✅ System management endpoints (circuit breakers, metrics, performance)
- ✅ Interactive API documentation (Swagger UI)
- ✅ Enhanced health checks with dependency monitoring
- ✅ Intelligent cache optimization with service-specific TTLs
- ✅ PostgreSQL caching & analytics
- ✅ Response time tracking (X-Response-Time headers)
- ✅ API versioning headers (X-API-Version: 1.0.0)
- ✅ CORS preflight caching (24-hour cache)
- ✅ Complete TypeScript SDK example with 8 use cases
- ✅ Quickstart guide for new developers
- ✅ Automated test suite (17/17 tests passing)
- ✅ Production deployment on Railway
- ✅ Frontend served by backend with SPA fallback
- ✅ Comprehensive testing (98.9% success rate)

### 🔄 In Progress
- 🔄 TypeScript & Python SDKs
- 🔄 Frontend marketplace UI enhancements
- 🔄 API key management system
- 🔄 Migration to SKALE Europa Hub mainnet

### 📋 Upcoming
- 📋 Marketplace UI
- 📋 Privacy mode (BITE-inspired)
- 📋 Additional SKALE ecosystem integrations
- 📋 SKALE grant application

## License

MIT

## Documentation

### Getting Started
- [Quick Start Guide](docs/QUICKSTART.md) - Get up and running
- [Production Deployment](docs/PRODUCTION.md) - Deploy to Railway/Netlify
- [SKALE Networks](docs/SKALE_NETWORKS.md) - Network configuration guide

### API Reference
- [API Endpoints Reference](docs/API_ENDPOINTS.md) - Complete API documentation
- [SKALE Integrations](docs/SKALE_INTEGRATIONS.md) - Ruby.Exchange, Chirper.ai, Gaming APIs
- [Batch API Guide](docs/BATCH_API.md) - Volume discounts & bulk calls

### Technical Details
- [SKALE Blockchain Integration](docs/SKALE_BLOCKCHAIN_INTEGRATION.md) - Web3 integration details
- [Architecture Overview](docs/ARCHITECTURE.md) - System architecture
- [Integration Guide](docs/INTEGRATION.md) - How to integrate PayPerAgent
- [Test Results](docs/COMPREHENSIVE_TEST_RESULTS.md) - Latest testing results
- [Project Status](docs/STATUS.md) - Current development status

## Links

- [SKALE Documentation](https://docs.skale.space)
- [x402 Protocol](https://docs.skale.space/cookbook/x402/become-an-x402-seller)
