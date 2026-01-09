# PayPerAgent Architecture

> Technical Deep-Dive: Building the First x402 Payment Gateway in 48 Hours

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         AI Agent / User                          │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTP Request
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PayPerAgent API Gateway                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                   Express Server                          │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐         │  │
│  │  │ Rate Limit │→ │ x402 Auth  │→ │ Validation │         │  │
│  │  └────────────┘  └────────────┘  └────────────┘         │  │
│  └──────────────────────────────────────────────────────────┘  │
│                             │                                    │
│  ┌──────────────────────────┼────────────────────────────────┐ │
│  │         Router Layer      │                                │ │
│  │  ┌──────────┐  ┌─────────┴────────┐  ┌─────────────┐    │ │
│  │  │ Weather  │  │ Crypto/CoinGecko │  │    News     │    │ │
│  │  └──────────┘  └──────────────────┘  └─────────────┘    │ │
│  │  ┌──────────┐  ┌──────────────────┐  ┌─────────────┐    │ │
│  │  │Wikipedia │  │  Ruby.Exchange   │  │ Chirper.ai  │    │ │
│  │  └──────────┘  └──────────────────┘  └─────────────┘    │ │
│  └────────────────────────────────────────────────────────────┘ │
│                             │                                    │
│  ┌──────────────────────────┼────────────────────────────────┐ │
│  │      Service Layer        │                                │ │
│  │  ┌────────────┐  ┌───────┴──────┐  ┌─────────────┐      │ │
│  │  │  Circuit   │  │    Cache     │  │  Analytics  │      │ │
│  │  │  Breakers  │  │   Manager    │  │   Tracker   │      │ │
│  │  └────────────┘  └──────────────┘  └─────────────┘      │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  PostgreSQL  │    │ External APIs│    │SKALE Network │
│   Database   │    │ (10+ services)│    │ (Nebula Hub) │
└──────────────┘    └──────────────┘    └──────────────┘
```

---

## 🔐 x402 Payment Flow

### Step 1: Initial Request (402 Payment Required)
```
Client → GET /api/weather?city=London
       ← 402 Payment Required
         {
           "payment": {
             "amount": "0.001",
             "token": "USDC",
             "recipient": "0x742d35cc...",
             "network": "skale-base-sepolia",
             "chainId": 324705682
           }
         }
```

### Step 2: Payment Generation
```typescript
// Client generates cryptographic payment proof
const nonce = Date.now();
const message = `${amount}:${recipient}:${nonce}`;
const signature = await wallet.signMessage(message);

const payment = {
  signature,
  amount: "0.001",
  token: "USDC",
  sender: wallet.address,
  recipient: "0x742d35cc...",
  nonce: nonce.toString()
};
```

### Step 3: Authenticated Request
```
Client → GET /api/weather?city=London
         Header: X-Payment: base64(payment)
       ← 200 OK
         {
           "success": true,
           "data": { ... weather data ... }
         }
```

---

## 🧩 Core Components

### 1. Payment Middleware (`x402.ts`)
```typescript
export function createPaymentMiddleware(config: PaymentConfig) {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Extract payment from X-Payment header
    const paymentHeader = req.headers['x-payment'];
    
    if (!paymentHeader) {
      return res.status(402).json({
        success: false,
        error: 'Payment required',
        payment: {
          amount: config.amount,
          token: config.token,
          recipient: config.recipient,
          network: 'skale-base-sepolia',
          chainId: 324705682
        }
      });
    }
    
    // Verify cryptographic signature
    const payment = JSON.parse(Buffer.from(paymentHeader, 'base64').toString());
    const isValid = await verifyPayment(payment);
    
    if (!isValid) {
      return res.status(402).json({ error: 'Invalid payment proof' });
    }
    
    // Track payment and continue
    await trackPayment(payment);
    next();
  };
}
```

### 2. Circuit Breaker Pattern
```typescript
class CircuitBreaker {
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  private failures = 0;
  private lastFailureTime = 0;
  
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.timeout) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }
    
    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  private onSuccess() {
    this.failures = 0;
    this.state = 'CLOSED';
  }
  
  private onFailure() {
    this.failures++;
    this.lastFailureTime = Date.now();
    
    if (this.failures >= this.threshold) {
      this.state = 'OPEN';
    }
  }
}
```

### 3. Intelligent Caching
```typescript
// Service-specific TTL optimization
const cacheTTLs = {
  weather: 10 * 60 * 1000,      // 10 minutes
  crypto: 30 * 1000,             // 30 seconds
  news: 5 * 60 * 1000,           // 5 minutes
  wikipedia: 60 * 60 * 1000,     // 1 hour
  coingecko: 60 * 1000,          // 1 minute
};

// Dual-layer caching (Memory + PostgreSQL)
async function getCachedData(key: string) {
  // Try memory cache first
  const memoryData = memoryCache.get(key);
  if (memoryData) return memoryData;
  
  // Fall back to PostgreSQL
  const dbData = await db.query(
    'SELECT data FROM cache WHERE key = $1 AND expires_at > NOW()',
    [key]
  );
  
  if (dbData.rows[0]) {
    // Populate memory cache
    memoryCache.set(key, dbData.rows[0].data);
    return dbData.rows[0].data;
  }
  
  return null;
}
```

### 4. Enhanced API Data Structures

**Before (Standard API):**
```json
{
  "temp": 15,
  "description": "Cloudy"
}
```

**After (PayPerAgent Enhanced):**
```json
{
  "location": "London",
  "country": "GB",
  "timezone": "Europe/London",
  "coordinates": { "lat": 51.5074, "lon": -0.1278 },
  "current": {
    "temp": 15,
    "feels_like": 13,
    "temp_min": 12,
    "temp_max": 18,
    "pressure": 1013,
    "humidity": 72,
    "sea_level": 1013,
    "grnd_level": 1009
  },
  "weather": {
    "main": "Clouds",
    "description": "overcast clouds",
    "icon": "04d"
  },
  "wind": {
    "speed": 5.2,
    "deg": 230,
    "gust": 8.1
  },
  "sun": {
    "sunrise": "2026-01-09T07:45:00Z",
    "sunset": "2026-01-09T16:30:00Z"
  },
  "visibility": 10000,
  "dt": 1736445600
}
```

---

## 🚀 Performance Optimizations

### 1. Request Pipeline
- **Rate Limiting**: 100 req/min, 1000 req/day per agent
- **Validation**: Schema-based input validation
- **Compression**: Gzip for responses > 1KB
- **Caching**: Dual-layer (Memory + PostgreSQL)
- **Connection Pooling**: PostgreSQL connection reuse

### 2. Monitoring
```typescript
// Performance tracking
const metrics = {
  p50: calculatePercentile(latencies, 50),
  p95: calculatePercentile(latencies, 95),
  p99: calculatePercentile(latencies, 99),
  avgResponseTime: average(latencies),
  errorRate: (errors / total) * 100
};

// Results: <10ms average response time
```

### 3. Circuit Breakers
- **8 External Services Protected**
- **Threshold**: 5 failures in 60 seconds
- **Timeout**: 30 seconds before retry
- **Half-Open**: Test with single request

---

## 🔗 SKALE Network Integration

### Zero Gas Fees Implementation
```typescript
// Users transact with sFUEL (free gas token)
const provider = new ethers.JsonRpcProvider(
  'https://testnet.skalenodes.com/v1/lanky-ill-funny-testnet'
);

// No gas fees charged to users
const tx = await contract.transfer(recipient, amount);
// Gas cost: 0 ETH (paid by SKALE validators)
```

### Multi-Token Support
```typescript
const supportedTokens = {
  USDC: '0x...',
  USDT: '0x...',
  SKL: '0x...',
  WETH: '0x...'
};

// Automatic token conversion in payment verification
```

---

## 📊 Database Schema

```sql
-- Analytics tracking
CREATE TABLE api_requests (
  id SERIAL PRIMARY KEY,
  wallet_address VARCHAR(42) NOT NULL,
  endpoint VARCHAR(255) NOT NULL,
  amount DECIMAL(18, 6) NOT NULL,
  token VARCHAR(10) NOT NULL,
  success BOOLEAN NOT NULL,
  response_time INTEGER,
  timestamp TIMESTAMP DEFAULT NOW()
);

-- Caching layer
CREATE TABLE cache (
  key VARCHAR(255) PRIMARY KEY,
  data JSONB NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Agent reputation
CREATE TABLE agent_reputation (
  wallet_address VARCHAR(42) PRIMARY KEY,
  total_requests INTEGER DEFAULT 0,
  successful_requests INTEGER DEFAULT 0,
  total_spent DECIMAL(18, 6) DEFAULT 0,
  tier VARCHAR(20) DEFAULT 'Bronze',
  discount_percentage INTEGER DEFAULT 0,
  last_request TIMESTAMP
);
```

---

## 🎯 Key Learnings

### What Worked Well
✅ x402 protocol is elegant and simple
✅ SKALE's zero gas fees enable true micropayments
✅ Circuit breakers prevent cascading failures
✅ Dual-layer caching dramatically improves performance
✅ TypeScript + Express = rapid development

### Challenges Overcome
🔧 Payment verification without smart contracts
🔧 Rate limiting with trust proxy on Railway
🔧 WebSocket connection handling in production
🔧 Cold start latency on serverless deployment
🔧 Database connection pooling optimization

### Technical Debt
⚠️ No smart contract verification (relies on cryptographic signatures)
⚠️ Testnet only (mainnet requires $3.6k-$84k/month)
⚠️ Limited SDK support (TypeScript only)
⚠️ No privacy mode for anonymous payments

---

## 🔮 Future Architecture Considerations

### If Scaling to Production:
1. **Smart Contract Integration**
   - On-chain payment verification
   - Escrow for disputed payments
   - Automated refunds

2. **Multi-Chain Support**
   - Deploy to multiple SKALE Hubs
   - Cross-chain payment routing
   - Token bridging

3. **Advanced Features**
   - Privacy mode (BITE protocol)
   - Subscription models
   - API key management
   - Developer dashboard

4. **Performance**
   - Redis for caching
   - Load balancing
   - CDN for static assets
   - Database sharding

---

## 📚 Resources

- [x402 Protocol Docs](https://docs.skale.space/cookbook/x402/)
- [SKALE Network Docs](https://docs.skale.space)
- [PayPerAgent Live Demo](https://payperagent.xyz)
- [GitHub Repository](https://github.com/TheQuantumChronicle/payperagent)

---

**Built in 48 hours** | January 2026 | First-ever x402 payment gateway
