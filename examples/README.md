# PayPerAgent Demo Agents

Example AI agents that use the PayPerAgent API Gateway.

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the API Gateway

In the `backend` directory:
```bash
npm run dev
```

### 3. Run Demo Agent

```bash
npm run demo
```

## Demo Agent

The demo agent (`demo-agent.ts`) shows how to:
- Make requests to paywalled APIs
- Handle 402 Payment Required responses
- Track agent usage with X-Agent-Id header

**Expected Output:**
```
🤖 PayPerAgent Demo Agent Starting...

📍 Test 1: Get Weather Data
💰 Payment Required!
Payment Info: {...}

💰 Test 2: Get Crypto Prices
💰 Payment Required!
Payment Info: {...}

📰 Test 3: Get News Headlines
💰 Payment Required!
Payment Info: {...}
```

## LangChain Agent (Coming Soon)

Full AI agent with:
- LangChain integration
- x402 payment generation
- Autonomous API access
- Multi-tool coordination

## Next Steps

1. **Add Payment Logic**: Implement x402 payment generation
2. **SKALE Wallet**: Set up wallet with testnet funds
3. **Full Integration**: Complete payment flow end-to-end
4. **LangChain Agent**: Build autonomous agent with tools

## Resources

- [PayPerAgent Docs](../docs/API.md)
- [x402 Protocol](https://docs.skale.space/cookbook/x402/buying)
- [SKALE Network](https://docs.skale.space)
