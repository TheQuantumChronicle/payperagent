# PayPerAgent LangChain Integration

Easy integration of PayPerAgent API Gateway with LangChain agents.

## Installation

```bash
npm install @payperagent/langchain
```

## Quick Start

```typescript
import { PayPerAgentTool } from '@payperagent/langchain';
import { initializeAgentExecutorWithOptions } from 'langchain/agents';
import { ChatOpenAI } from 'langchain/chat_models/openai';

// Initialize PayPerAgent tools
const weatherTool = new PayPerAgentTool({
  name: 'weather',
  description: 'Get current weather for any city',
  endpoint: 'https://payperagent.xyz/api/weather',
  walletAddress: '0x...',
  privateKey: process.env.PRIVATE_KEY,
});

const cryptoTool = new PayPerAgentTool({
  name: 'crypto_price',
  description: 'Get cryptocurrency prices',
  endpoint: 'https://payperagent.xyz/api/crypto',
  walletAddress: '0x...',
  privateKey: process.env.PRIVATE_KEY,
});

// Create LangChain agent with PayPerAgent tools
const model = new ChatOpenAI({ temperature: 0 });
const tools = [weatherTool, cryptoTool];

const executor = await initializeAgentExecutorWithOptions(tools, model, {
  agentType: 'zero-shot-react-description',
  verbose: true,
});

// Use the agent
const result = await executor.call({
  input: 'What is the weather in London and the price of Bitcoin?',
});

console.log(result.output);
```

## Features

- ✅ **Automatic Payment Handling** - x402 payments handled automatically
- ✅ **Zero Gas Fees** - All transactions on SKALE Network
- ✅ **Multi-token Support** - Pay with USDC, USDT, SKL, or WETH
- ✅ **Reputation System** - Earn discounts with usage
- ✅ **Batch Requests** - Optimize costs with batching

## Available Tools

### Weather Tool
```typescript
const weather = new PayPerAgentTool({
  name: 'weather',
  description: 'Get weather data',
  endpoint: '/api/weather',
});
```

### Crypto Price Tool
```typescript
const crypto = new PayPerAgentTool({
  name: 'crypto',
  description: 'Get cryptocurrency prices',
  endpoint: '/api/crypto',
});
```

### News Tool
```typescript
const news = new PayPerAgentTool({
  name: 'news',
  description: 'Get latest news',
  endpoint: '/api/news',
});
```

### AI Search Tool (Perplexity)
```typescript
const search = new PayPerAgentTool({
  name: 'ai_search',
  description: 'Search with AI',
  endpoint: '/api/perplexity',
});
```

### SKALE Gaming Tool
```typescript
const gaming = new PayPerAgentTool({
  name: 'skale_gaming',
  description: 'Get SKALE gaming data',
  endpoint: '/api/gaming',
});
```

## Advanced Usage

### Custom Payment Configuration
```typescript
const tool = new PayPerAgentTool({
  name: 'custom_api',
  endpoint: '/api/custom',
  payment: {
    token: 'USDC',
    network: 'skale',
    maxAmount: '0.01',
  },
});
```

### Batch Requests
```typescript
import { PayPerAgentBatch } from '@payperagent/langchain';

const batch = new PayPerAgentBatch({
  walletAddress: '0x...',
  privateKey: process.env.PRIVATE_KEY,
});

const results = await batch.execute([
  { endpoint: '/api/weather', params: { city: 'London' } },
  { endpoint: '/api/crypto', params: { symbol: 'BTC' } },
  { endpoint: '/api/news', params: { category: 'technology' } },
]);
```

## Error Handling

```typescript
try {
  const result = await weatherTool.call({ city: 'London' });
} catch (error) {
  if (error.code === 'INSUFFICIENT_FUNDS') {
    console.log('Please add funds to your wallet');
  } else if (error.code === 'PAYMENT_REQUIRED') {
    console.log('Payment verification failed');
  }
}
```

## Examples

See `/examples/langchain/` for complete examples:
- `basic-agent.ts` - Simple weather and crypto agent
- `multi-agent.ts` - Collaborative agents with CrewAI
- `autonomous-agent.ts` - Fully autonomous agent with AutoGPT
- `data-analysis.ts` - Agent with LlamaIndex for data retrieval

## Documentation

Full documentation: https://docs.payperagent.com/langchain
