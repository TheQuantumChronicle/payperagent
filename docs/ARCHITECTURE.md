# PayPerAgent Architecture

## System Overview

PayPerAgent is built as a modular, scalable API gateway with a clear separation of concerns and extensibility for marketplace features.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        AI Agents                             │
│  (LangChain, AutoGPT, Custom Agents)                        │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP + X-PAYMENT header
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                   PayPerAgent Gateway                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Express.js Server (Port 3000)                       │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐    │  │
│  │  │  Helmet    │  │   CORS     │  │ Analytics  │    │  │
│  │  └────────────┘  └────────────┘  └────────────┘    │  │
│  └──────────────────────────────────────────────────────┘  │
│                           │                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Rate Limiting Middleware                            │  │
│  │  • 100 req/min per IP                                │  │
│  │  • 1000 req/day per agent                            │  │
│  └──────────────────────────────────────────────────────┘  │
│                           │                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  x402 Payment Middleware (@faremeter)                │  │
│  │  • Payment verification                              │  │
│  │  • Facilitator integration                           │  │
│  │  • Cache (256 capacity, 30s TTL)                     │  │
│  └──────────────────────────────────────────────────────┘  │
│                           │                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  API Routes                                          │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐          │  │
│  │  │ Weather  │  │  Crypto  │  │   News   │          │  │
│  │  │ 0.001 $  │  │ 0.002 $  │  │ 0.005 $  │          │  │
│  │  └──────────┘  └──────────┘  └──────────┘          │  │
│  └──────────────────────────────────────────────────────┘  │
│                           │                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Service Layer (External API Integration)           │  │
│  │  • Error handling                                    │  │
│  │  • Input validation                                  │  │
│  │  • Response transformation                           │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ OpenWeather  │ │  CoinGecko   │ │   NewsAPI    │
│     API      │ │     API      │ │              │
└──────────────┘ └──────────────┘ └──────────────┘

        ┌────────────┐
        │   SKALE    │
        │  Network   │
        │ (Testnet)  │
        └────────────┘
             ▲
             │ x402 Payments
             │
    ┌────────┴────────┐
    │  Facilitator    │
    │   Service       │
    └─────────────────┘
```

## Component Details

### 1. Entry Point (`src/index.ts`)
- Express app initialization
- Middleware registration
- Route mounting
- Server startup

### 2. Middleware Layer

#### Security Middleware
- **Helmet:** HTTP security headers
- **CORS:** Cross-origin resource sharing
- **Rate Limiting:** DDoS protection

#### Payment Middleware (`src/middleware/x402.ts`)
- Integrates @faremeter/middleware
- Checks for X-PAYMENT header
- Returns 402 if payment missing
- Verifies payment with facilitator
- Caches verified payments

#### Analytics Middleware (`src/middleware/analytics.ts`)
- Tracks every request
- Records response time
- Stores agent ID
- Maintains in-memory log (10k records)

### 3. Route Layer

#### Gateway Router (`src/routes/gateway.ts`)
- Main API info endpoint
- Service discovery
- Endpoint documentation

#### API Routers (`src/routes/apis/`)
- Weather router
- Crypto router
- News router
- Each with x402 protection

#### Analytics Router (`src/routes/analytics.ts`)
- Usage statistics
- Per-agent metrics
- Endpoint performance

### 4. Service Layer (`src/services/`)

Each service follows the same pattern:
```typescript
1. Validate input parameters
2. Check API key configuration
3. Make external API request (5s timeout)
4. Transform response to standard format
5. Handle errors with specific messages
6. Return structured data
```

### 5. Configuration Layer (`src/config/`)

#### SKALE Config (`skale.ts`)
- RPC URL
- Chain ID
- Facilitator URL
- Network name
- Provider/wallet setup

#### Pricing Config (`pricing.ts`)
- Per-service pricing
- Payment descriptions
- Easy to modify

### 6. Utilities (`src/utils/`)

#### Logger (`logger.ts`)
- Structured logging
- Log levels (ERROR, WARN, INFO, DEBUG)
- Timestamp formatting

#### Validation (`validation.ts`)
- City name validation
- Coordinate validation
- Crypto symbol validation
- News category validation
- Input sanitization

### 7. Type System (`src/types/`)
- Request/response interfaces
- Payment types
- Analytics types
- Service metadata types

## Data Flow

### Request Flow (Without Payment)
```
1. Agent → HTTP GET /api/weather?city=London
2. Gateway → Rate Limiting Check
3. Gateway → x402 Middleware Check
4. x402 → No X-PAYMENT header found
5. x402 → Return 402 Payment Required
6. Agent ← Receives payment requirements
```

### Request Flow (With Payment)
```
1. Agent → HTTP GET /api/weather?city=London
           + X-PAYMENT: <proof>
2. Gateway → Rate Limiting Check
3. Gateway → x402 Middleware Check
4. x402 → Verify payment with facilitator
5. x402 → Payment valid, continue
6. Gateway → Weather Service
7. Service → Validate input
8. Service → Call OpenWeather API
9. Service → Transform response
10. Gateway → Analytics tracking
11. Agent ← Receive weather data
```

## Payment Flow

```
┌─────────┐                 ┌──────────────┐
│  Agent  │                 │   Gateway    │
└────┬────┘                 └──────┬───────┘
     │                             │
     │  1. GET /api/weather        │
     │────────────────────────────>│
     │                             │
     │  2. 402 Payment Required    │
     │<────────────────────────────│
     │    + payment requirements   │
     │                             │
     │  3. Generate payment        │
     │     on SKALE Network        │
     │                             │
     │  4. GET /api/weather        │
     │    + X-PAYMENT header       │
     │────────────────────────────>│
     │                             │
     │                        ┌────▼─────┐
     │                        │Facilitator│
     │                        └────┬─────┘
     │                             │
     │                        5. Verify
     │                             │
     │                        ┌────▼─────┐
     │                        │  SKALE   │
     │                        │ Network  │
     │                        └────┬─────┘
     │                             │
     │                        6. Confirmed
     │                             │
     │  7. Weather data            │
     │<────────────────────────────│
     │                             │
```

## Scalability Considerations

### Horizontal Scaling
- Stateless design (except in-memory analytics)
- Can run multiple instances behind load balancer
- Analytics can be moved to Redis/database

### Vertical Scaling
- Efficient async/await patterns
- Connection pooling for external APIs
- Request timeouts prevent hanging

### Database (Future)
```
┌─────────────────┐
│   PostgreSQL    │
│                 │
│  • Services     │
│  • Agents       │
│  • Transactions │
│  • Analytics    │
│  • Reviews      │
└─────────────────┘
```

## Security Architecture

### Defense in Depth
1. **Network:** CORS, Helmet headers
2. **Application:** Rate limiting, input validation
3. **Payment:** x402 verification, facilitator
4. **Data:** Sanitization, error message filtering

### Payment Security
- No private keys in code
- Environment variable configuration
- Facilitator handles settlement
- Payment caching prevents replay

## Monitoring & Observability

### Current
- Console logging
- In-memory analytics
- Error tracking

### Future
- Sentry for error tracking
- DataDog/New Relic for APM
- Prometheus metrics
- Grafana dashboards

## Extension Points

### Adding New API Services
1. Create service file in `src/services/`
2. Create router in `src/routes/apis/`
3. Add pricing in `src/config/pricing.ts`
4. Mount router in `src/routes/gateway.ts`
5. Update documentation

### Adding Marketplace Features
1. Create database schema
2. Add service registry routes
3. Implement discovery API
4. Add agent authentication
5. Build rating system
6. Create frontend UI

## Performance Characteristics

### Response Times
- Health check: < 10ms
- Gateway info: < 20ms
- API calls (with payment): 100-500ms
- API calls (without payment): < 50ms

### Throughput
- Rate limit: 100 req/min per IP
- Agent limit: 1000 req/day
- Theoretical max: ~6000 req/min (single instance)

### Resource Usage
- Memory: ~50-100MB base
- CPU: Low (I/O bound)
- Network: Depends on external APIs

## Deployment Architecture

### Development
```
localhost:3000 → Express Server
```

### Production (Planned)
```
CloudFlare → Load Balancer → [Instance 1, Instance 2, Instance 3]
                                     ↓
                              PostgreSQL + Redis
```

## Technology Decisions

### Why Express.js?
- Mature, stable, well-documented
- Large middleware ecosystem
- Easy to extend
- Good TypeScript support

### Why @faremeter/middleware?
- Official x402 implementation
- Handles payment verification
- Integrates with SKALE facilitator
- Battle-tested

### Why In-Memory Analytics?
- Fast for MVP
- No database dependency
- Easy to migrate later
- Sufficient for testing

### Why TypeScript?
- Type safety
- Better IDE support
- Easier refactoring
- Industry standard

## Future Architecture (Marketplace)

```
┌──────────────────────────────────────────┐
│           Frontend (React)               │
│  • Service discovery                     │
│  • Agent dashboard                       │
│  • Analytics visualization               │
└────────────────┬─────────────────────────┘
                 │
┌────────────────▼─────────────────────────┐
│        API Gateway (Current)             │
└────────────────┬─────────────────────────┘
                 │
┌────────────────▼─────────────────────────┐
│       Marketplace Services               │
│  • Service registry                      │
│  • Agent authentication                  │
│  • Rating/review system                  │
│  • Payment tracking                      │
└────────────────┬─────────────────────────┘
                 │
┌────────────────▼─────────────────────────┐
│          PostgreSQL Database             │
└──────────────────────────────────────────┘
```

---

**This architecture is designed for:**
- ✅ Scalability
- ✅ Maintainability
- ✅ Security
- ✅ Performance
- ✅ Extensibility
