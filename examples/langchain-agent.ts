/**
 * LangChain Integration Example
 * Shows how to use PayPerAgent with LangChain agents
 */

import axios from 'axios';
import { ethers } from 'ethers';

const API_BASE = process.env.API_BASE || 'http://localhost:3000/api';
const WALLET_PRIVATE_KEY = process.env.PRIVATE_KEY || '';
const WALLET_ADDRESS = process.env.WALLET_ADDRESS || '';

interface PayPerAgentToolConfig {
  name: string;
  description: string;
  endpoint: string;
  params?: Record<string, any>;
}

/**
 * PayPerAgent Tool for LangChain
 * Automatically handles x402 payments
 */
class PayPerAgentTool {
  private config: PayPerAgentToolConfig;
  private wallet?: ethers.Wallet;

  constructor(config: PayPerAgentToolConfig) {
    this.config = config;
    
    // Initialize wallet for payments
    if (WALLET_PRIVATE_KEY) {
      this.wallet = new ethers.Wallet(WALLET_PRIVATE_KEY);
    }
  }

  async call(params: Record<string, any>): Promise<any> {
    try {
      console.log(`\n🔧 ${this.config.name}: Calling ${this.config.endpoint}`);
      console.log(`📊 Params:`, params);

      // First attempt - will return 402 if payment required
      try {
        const response = await axios.get(`${API_BASE}${this.config.endpoint}`, {
          params,
          headers: {
            'X-Agent-Id': 'langchain-agent',
          },
        });
        
        console.log(`✅ Success (cached or free):`, response.data);
        return response.data;
      } catch (error: any) {
        if (error.response?.status === 402) {
          console.log(`💰 Payment required`);
          
          // Generate payment proof
          const paymentProof = await this.generatePayment(error.response.data.payment);
          
          // Retry with payment
          const response = await axios.get(`${API_BASE}${this.config.endpoint}`, {
            params,
            headers: {
              'X-Agent-Id': 'langchain-agent',
              'X-Payment': paymentProof,
            },
          });
          
          console.log(`✅ Success (paid):`, response.data);
          return response.data;
        }
        throw error;
      }
    } catch (error: any) {
      console.error(`❌ Error in ${this.config.name}:`, error.message);
      throw error;
    }
  }

  private async generatePayment(paymentInfo: any): Promise<string> {
    // In production, this would:
    // 1. Sign transaction on SKALE Network
    // 2. Submit to blockchain
    // 3. Generate payment proof
    
    // For demo, return mock payment proof
    const proof = {
      signature: 'mock_signature',
      timestamp: Date.now(),
      amount: paymentInfo.amount,
      from: WALLET_ADDRESS,
      to: paymentInfo.recipient,
    };
    
    return Buffer.from(JSON.stringify(proof)).toString('base64');
  }
}

/**
 * Simple LangChain-style Agent
 * Demonstrates tool usage pattern
 */
class SimpleAgent {
  private tools: Map<string, PayPerAgentTool>;

  constructor(tools: PayPerAgentTool[]) {
    this.tools = new Map();
    tools.forEach(tool => {
      this.tools.set(tool['config'].name, tool);
    });
  }

  async run(task: string): Promise<string> {
    console.log(`\n🤖 Agent Task: "${task}"\n`);
    console.log('=' .repeat(60));

    // Simple task parsing (in real LangChain, this would use LLM)
    if (task.toLowerCase().includes('weather')) {
      const weatherTool = this.tools.get('weather');
      const city = this.extractCity(task);
      const result = await weatherTool?.call({ city });
      return `Weather in ${city}: ${JSON.stringify(result)}`;
    }
    
    if (task.toLowerCase().includes('crypto') || task.toLowerCase().includes('bitcoin')) {
      const cryptoTool = this.tools.get('crypto');
      const result = await cryptoTool?.call({ symbols: 'BTCUSDT,ETHUSDT' });
      return `Crypto prices: ${JSON.stringify(result)}`;
    }
    
    if (task.toLowerCase().includes('news')) {
      const newsTool = this.tools.get('news');
      const result = await newsTool?.call({ category: 'technology' });
      return `Latest news: ${JSON.stringify(result)}`;
    }

    return 'Task not understood. Available tools: weather, crypto, news';
  }

  private extractCity(task: string): string {
    // Simple city extraction
    const cities = ['london', 'paris', 'tokyo', 'new york', 'san francisco'];
    for (const city of cities) {
      if (task.toLowerCase().includes(city)) {
        return city;
      }
    }
    return 'London'; // default
  }
}

/**
 * Demo: LangChain-style agent with PayPerAgent tools
 */
async function runLangChainDemo() {
  console.log('🚀 PayPerAgent + LangChain Integration Demo\n');
  console.log('=' .repeat(60));

  // Initialize tools
  const weatherTool = new PayPerAgentTool({
    name: 'weather',
    description: 'Get current weather for any city',
    endpoint: '/weather',
  });

  const cryptoTool = new PayPerAgentTool({
    name: 'crypto',
    description: 'Get cryptocurrency prices',
    endpoint: '/crypto',
  });

  const newsTool = new PayPerAgentTool({
    name: 'news',
    description: 'Get latest news headlines',
    endpoint: '/news',
  });

  // Create agent
  const agent = new SimpleAgent([weatherTool, cryptoTool, newsTool]);

  // Run tasks
  await agent.run('What is the weather in London?');
  await agent.run('Get me the price of Bitcoin and Ethereum');
  await agent.run('Show me technology news');

  console.log('\n' + '='.repeat(60));
  console.log('✨ Demo Complete!\n');
  console.log('💡 Integration Benefits:');
  console.log('   ✅ Automatic payment handling');
  console.log('   ✅ Zero gas fees on SKALE');
  console.log('   ✅ Works with any LangChain agent');
  console.log('   ✅ Compatible with AutoGPT, CrewAI, etc.\n');
}

// Run demo
runLangChainDemo().catch(console.error);
