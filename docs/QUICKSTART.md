# PayPerAgent Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Node.js 18+ installed
- npm or yarn
- Text editor

### Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 2: Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and add your API keys:

```env
PORT=3000
NODE_ENV=development

# SKALE Network Configuration
SKALE_RPC_URL=https://testnet.skalenodes.com/v1/lanky-ill-funny-testnet
SKALE_CHAIN_ID=1351057110
FACILITATOR_URL=https://facilitator.dirtroad.dev

# API Keys (Get free keys from these services)
OPENWEATHER_API_KEY=your_key_here
COINGECKO_API_KEY=optional
NEWS_API_KEY=your_key_here

# Payment Configuration
PAYMENT_WALLET_PRIVATE_KEY=your_wallet_private_key
PAYMENT_TOKEN_ADDRESS=0x...
MAX_AMOUNT_REQUIRED=1.5
PAYMENT_DESCRIPTION=PayPerAgent API Access
```

### Step 3: Get Free API Keys

#### OpenWeather API (Required)
1. Visit https://openweathermap.org/api
2. Sign up for free account
3. Copy API key from dashboard
4. Paste into `.env` file

#### News API (Required)
1. Visit https://newsapi.org
2. Sign up for free account
3. Copy API key
4. Paste into `.env` file

#### CoinGecko (Optional)
- Free tier works without API key
- Rate limited but sufficient for testing

### Step 4: Start the Server

```bash
npm run dev
```

You should see:
```
🚀 PayPerAgent API Gateway running on port 3000
📡 Environment: development
⛓️  SKALE Network: https://testnet.skalenodes.com/v1/lanky-ill-funny-testnet
💰 x402 Payment Protocol: Enabled
🔒 Rate Limiting: 100 req/min, 1000 req/day per agent
```

### Step 5: Test the API

#### Health Check
```bash
curl http://localhost:3000/health
```

#### Gateway Info
```bash
curl http://localhost:3000/api
```

#### Test Weather API (will return 402 Payment Required)
```bash
curl http://localhost:3000/api/weather?city=London
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

### Step 6: Run Demo Agent

```bash
cd ../examples
npm install
npm run demo
```

## 🎯 What You Built

✅ **API Gateway** with 3 paywalled endpoints:
- Weather data (0.001 USDC/request)
- Crypto prices (0.002 USDC/request)  
- News articles (0.005 USDC/request)

✅ **x402 Payment Protocol** integration

✅ **Rate Limiting** (100 req/min, 1000 req/day per agent)

✅ **Usage Analytics** tracking

✅ **Demo AI Agent** that interacts with the gateway

## 🔧 Troubleshooting

### Port Already in Use
Change `PORT` in `.env` to another port (e.g., 3001)

### API Key Errors
- Check that API keys are correctly pasted in `.env`
- Ensure no extra spaces or quotes
- Restart server after changing `.env`

### Payment Middleware Errors
- Ensure SKALE_RPC_URL is accessible
- Check facilitator URL is correct
- Wait a few seconds for middleware initialization

## 📚 Next Steps

1. **Set up SKALE Wallet**
   - Create wallet with MetaMask or ethers.js
   - Get testnet funds from SKALE faucet
   - Add private key to `.env`

2. **Implement Payment Flow**
   - Generate x402 payments on SKALE
   - Add X-PAYMENT header to requests
   - Access paywalled data

3. **Build Marketplace**
   - Add service registry
   - Implement discovery system
   - Create frontend UI

4. **Deploy to Production**
   - Deploy to Railway/Render
   - Configure production environment
   - Set up monitoring

## 🆘 Support

- Documentation: `/docs/API.md`
- Integration Guide: `/docs/INTEGRATION.md`
- Issues: GitHub Issues
- Discord: [Join Community]

## 🎉 Success!

Your PayPerAgent API Gateway is now running! You've built infrastructure for the Internet of Agents on SKALE Network.
