# 🚀 PayPerAgent Quick Start Guide

Get started with PayPerAgent in 5 minutes!

## Prerequisites

- Node.js 18+ or Python 3.8+
- SKALE wallet with USDC
- Private key from your wallet

## Step 1: Get Testnet USDC

Visit the [SKALE Faucet](https://www.sfuelstation.com/) to get free testnet USDC.

## Step 2: Install SDK

### TypeScript/JavaScript
```bash
npm install @payperagent/sdk ethers dotenv
```

### Python
```bash
pip install payperagent python-dotenv
```

## Step 3: Set Up Environment

Create a `.env` file:
```bash
PRIVATE_KEY=your_wallet_private_key_here
API_URL=https://payperagent.xyz
```

## Step 4: Run Example

### TypeScript
```bash
# Clone examples
git clone https://github.com/YourOrg/payperagent.git
cd payperagent/examples

# Install dependencies
npm install

# Run example
npx ts-node typescript-example.ts
```

### Python
```bash
# Run example
python python-example.py
```

## Step 5: Start Building!

```typescript
import { createClient } from '@payperagent/sdk';
import { ethers } from 'ethers';

const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!);
const client = createClient({
  gatewayUrl: 'https://payperagent.xyz',
  wallet,
  autoRetry: true
});

// Get weather - SDK handles payment automatically!
const weather = await client.getWeather({ city: 'London' });
console.log(weather);
```

## 🎯 What You Can Build

- **AI Agents** - Autonomous agents that access data and pay for APIs
- **Trading Bots** - Real-time crypto data with micro-payments
- **Data Aggregators** - Combine multiple APIs with batch calls
- **Analytics Dashboards** - Live data from multiple sources
- **Automation Tools** - Schedule API calls with automatic payments

## 📚 Next Steps

- Read the [Full Documentation](https://github.com/YourOrg/payperagent/tree/main/docs)
- Explore [More Examples](https://github.com/YourOrg/payperagent/tree/main/examples)
- Join [Discord Community](https://discord.gg/skale)
- Check [API Reference](https://payperagent.xyz/api)

## 💡 Tips

- **Zero Gas Fees** - All transactions on SKALE are free!
- **Micro-Payments** - Pay as little as 0.0005 USDC per API call
- **Automatic Retry** - SDK handles 402 responses automatically
- **Batch Discounts** - Save 10-30% on bulk API calls
- **Reputation System** - Earn discounts as you use more APIs

## 🆘 Need Help?

- Check [Troubleshooting Guide](https://github.com/YourOrg/payperagent/blob/main/docs/troubleshooting.md)
- Ask in [Discord](https://discord.gg/skale)
- Open an [Issue](https://github.com/YourOrg/payperagent/issues)

---

**Happy Building! 🚀**
