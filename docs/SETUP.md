# PayPerAgent Setup Guide

## Quick Start (3 Steps)

### 1. Configure Environment Variables

Edit `backend/.env` with your API keys:

```bash
cd backend
nano .env  # or use your preferred editor
```

**Required:**
- `OPENWEATHER_API_KEY` - Get free key at https://openweathermap.org/api
- `PAYMENT_WALLET_PRIVATE_KEY` - Your SKALE wallet private key

**Optional (for testing):**
- `COINGECKO_API_KEY` - CoinGecko is free without key (rate limited)
- `NEWS_API_KEY` - Get free key at https://newsapi.org

### 2. Get API Keys

#### OpenWeather (Required)
1. Visit https://openweathermap.org/api
2. Sign up for free account
3. Get API key from dashboard
4. Add to `.env` file

#### SKALE Wallet (Required)
1. Install MetaMask or create wallet with ethers
2. Get testnet funds from SKALE faucet
3. Export private key
4. Add to `.env` file

**⚠️ SECURITY: Never commit .env file or share private keys!**

### 3. Start the Server

```bash
cd backend
npm run dev
```

Server will start on https://payperagent.xyz

## Test the API

### Health Check
```bash
curl https://payperagent.xyz/health
```

### Weather API (without payment - will get 402)
```bash
curl "https://payperagent.xyz/api/weather?city=London"
```

Expected response:
```json
{
  "success": false,
  "error": "Payment Required",
  "payment": {
    "facilitatorURL": "https://facilitator.dirtroad.dev",
    "accepts": [...]
  }
}
```

### Crypto API (without payment - will get 402)
```bash
curl "https://payperagent.xyz/api/crypto?symbol=bitcoin"
```

## Next Steps

1. **Integrate x402 Payment Flow** - Currently returns 402, need to implement full payment verification
2. **Add Rate Limiting** - Protect endpoints from abuse
3. **Add Usage Analytics** - Track API calls per agent
4. **Deploy to Testnet** - Get it live for testing
5. **Build Demo AI Agent** - Show real agent using the gateway

## Project Status

✅ Project structure created  
✅ Dependencies installed  
✅ API endpoints scaffolded  
✅ SKALE configuration ready  
🔄 x402 payment flow (needs full implementation)  
⏳ Testing & deployment  
⏳ Demo agent  

## Troubleshooting

**Port already in use:**
```bash
# Change PORT in .env file
PORT=3001
```

**Missing API keys:**
- Server will start but endpoints will fail
- Check console logs for specific errors

**TypeScript errors:**
```bash
npm run build  # Check for compilation errors
```

## Resources

- [SKALE Docs](https://docs.skale.space)
- [x402 Protocol](https://docs.skale.space/cookbook/x402/become-an-x402-seller)
- [API Documentation](./docs/API.md)
- [Integration Guide](./docs/INTEGRATION.md)
