# PayPerAgent Production Deployment

## 🌐 Live URLs

- **Website**: https://payperagent.xyz
- **API Base**: https://payperagent.xyz/api
- **WebSocket**: wss://payperagent.xyz/ws
- **API Docs**: https://payperagent.xyz/docs
- **Health Check**: https://payperagent.xyz/health

## 🚀 Infrastructure

### Backend (Railway)
- **Platform**: Railway
- **Database**: PostgreSQL (Railway managed)
- **Environment**: Production
- **Auto-deploy**: Enabled on `main` branch

### Frontend (Netlify/Vercel)
- **Domain**: payperagent.xyz
- **Build**: Vite + React + TypeScript
- **Environment Variables**:
  - `VITE_API_URL=https://payperagent.xyz`
  - `VITE_WS_URL=wss://payperagent.xyz/ws`

### Blockchain
- **Network**: SKALE Network
- **Chain**: Base Sepolia Testnet
- **Chain ID**: 324705682
- **RPC**: https://base-sepolia-testnet.skalenodes.com/v1/jubilant-horrible-ancha
- **Gas Fees**: Zero ⛽️

## 🔑 Environment Variables

### Required for Backend (.env)
```bash
# Server
PORT=3000
NODE_ENV=production

# SKALE Network
SKALE_RPC_URL=https://base-sepolia-testnet.skalenodes.com/v1/jubilant-horrible-ancha
SKALE_CHAIN_ID=324705682

# Database (Railway provides this)
DATABASE_URL=postgresql://...

# Payment
FACILITATOR_URL=https://facilitator.dirtroad.dev
PAYMENT_WALLET_PRIVATE_KEY=<your_key>
PAYMENT_TOKEN_ADDRESS=0x85889c8c714505E0c94b30fcfcF64fE3Ac8FCb20

# API Keys
OPENWEATHER_API_KEY=<your_key>
NEWS_API_KEY=<your_key>
PERPLEXITY_API_KEY=<your_key>
XAI_API_KEY=<your_key>

# Domain
FRONTEND_URL=https://payperagent.xyz
```

## 📊 Monitoring

### Health Endpoints
```bash
# Overall health
curl https://payperagent.xyz/health

# System metrics
curl https://payperagent.xyz/system/metrics

# Circuit breakers
curl https://payperagent.xyz/system/circuit-breakers

# Performance stats
curl https://payperagent.xyz/system/performance
```

### Analytics
```bash
# Usage analytics
curl https://payperagent.xyz/analytics/usage

# Agent leaderboard
curl https://payperagent.xyz/api/reputation/leaderboard

# Cache statistics
curl https://payperagent.xyz/cache/stats
```

## 🧪 Testing Production

### Test API Endpoints
```bash
# Set production URL
export API_URL=https://payperagent.xyz

# Run backend tests
./backend/src/tests/test-backend.sh

# Run API tests
./backend/src/tests/test-all-apis.sh
```

### Test WebSocket
```bash
# Test WebSocket connection
node backend/src/tests/test-websocket.js
```

## 🔄 Deployment Process

### Automatic Deployment
1. Push to `main` branch
2. Railway automatically builds and deploys backend
3. Frontend auto-deploys on Netlify/Vercel

### Manual Deployment
```bash
# Backend (Railway CLI)
railway up

# Frontend
cd frontend
npm run build
# Deploy dist/ folder to hosting
```

## 🛠️ Troubleshooting

### Check Railway Logs
```bash
railway logs
```

### Check Database Connection
```bash
# From Railway environment
railway run node backend/src/tests/test-db-connection.js
```

### Verify DNS Propagation
```bash
# Check if domain resolves
dig payperagent.xyz

# Test HTTPS
curl -I https://payperagent.xyz
```

## 📈 Performance

- **Average Response Time**: <50ms
- **Uptime Target**: 99.9%
- **Database**: PostgreSQL with connection pooling
- **Caching**: Dual-layer (Memory + PostgreSQL)
- **Rate Limiting**: 100 req/min, 1000 req/day per agent

## 🔐 Security

- ✅ HTTPS/TLS encryption
- ✅ CORS configured for production domain
- ✅ Rate limiting enabled
- ✅ Input validation on all endpoints
- ✅ SQL injection protection
- ✅ Environment variables secured
- ✅ Private keys never committed to git

## 📞 Support

- **Issues**: GitHub Issues
- **Documentation**: [docs/](docs/)
- **API Reference**: https://payperagent.xyz/docs
