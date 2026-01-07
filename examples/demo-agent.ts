import axios from 'axios';

const API_BASE = process.env.API_BASE || 'http://localhost:3000/api';
const AGENT_ID = 'demo-agent-001';

interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
  payment?: any;
}

class PayPerAgentClient {
  private baseUrl: string;
  private agentId: string;

  constructor(baseUrl: string, agentId: string) {
    this.baseUrl = baseUrl;
    this.agentId = agentId;
  }

  private async makeRequest(endpoint: string, params: Record<string, any> = {}): Promise<any> {
    try {
      console.log(`\n🔍 Requesting: ${endpoint}`);
      console.log(`📊 Params:`, params);

      const response = await axios.get(`${this.baseUrl}${endpoint}`, {
        params,
        headers: {
          'X-Agent-Id': this.agentId,
        },
      });

      console.log(`✅ Success:`, response.data);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 402) {
        console.log(`💰 Payment Required!`);
        console.log(`Payment Info:`, JSON.stringify(error.response.data.payment, null, 2));
        console.log(`\n⚠️  To complete this request, you need to:`);
        console.log(`   1. Generate payment on SKALE Network`);
        console.log(`   2. Include X-PAYMENT header with payment proof`);
        console.log(`   3. Retry the request\n`);
        return error.response.data;
      }
      
      console.error(`❌ Error:`, error.response?.data || error.message);
      throw error;
    }
  }

  async getWeather(city: string) {
    return this.makeRequest('/weather', { city });
  }

  async getCryptoPrice(symbol: string) {
    return this.makeRequest('/crypto', { symbol });
  }

  async getNews(query?: string, category?: string) {
    return this.makeRequest('/news', { query, category });
  }
}

async function runDemo() {
  console.log('🤖 PayPerAgent Demo Agent Starting...\n');
  console.log('=' .repeat(60));

  const client = new PayPerAgentClient(API_BASE, AGENT_ID);

  console.log('\n📍 Test 1: Get Weather Data');
  console.log('-'.repeat(60));
  await client.getWeather('London');

  console.log('\n💰 Test 2: Get Crypto Prices');
  console.log('-'.repeat(60));
  await client.getCryptoPrice('bitcoin');

  console.log('\n📰 Test 3: Get News Headlines');
  console.log('-'.repeat(60));
  await client.getNews('technology');

  console.log('\n' + '='.repeat(60));
  console.log('✨ Demo Complete!\n');
  console.log('💡 Next Steps:');
  console.log('   - Set up SKALE wallet with testnet funds');
  console.log('   - Implement payment generation logic');
  console.log('   - Add X-PAYMENT header to requests');
  console.log('   - Access paywalled API data!\n');
}

runDemo().catch(console.error);
