import axios from 'axios';
import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config({ path: './backend/.env' });

const API_URL = process.env.API_URL || 'http://localhost:3000';
const TEST_PRIVATE_KEY = process.env.TEST_PAYMENT_PRIVATE_KEY!;

const wallet = new ethers.Wallet(TEST_PRIVATE_KEY);

async function generatePaymentProof(amount: string, recipient: string) {
  const nonce = Date.now();
  const message = `${amount}:${recipient}:${nonce}`;
  const signature = await wallet.signMessage(message);
  
  return JSON.stringify({
    signature,
    amount,
    token: 'USDC',
    sender: wallet.address,
    recipient,
    nonce: nonce.toString(),
  });
}

async function testEnhancedAPI(endpoint: string, amount: string, expectedKeys: string[]) {
  console.log(`\n🧪 Testing Enhanced: ${endpoint}`);
  
  try {
    // Get payment details
    let recipient: string;
    try {
      const initialResponse = await axios.get(`${API_URL}${endpoint}`);
      recipient = initialResponse.data.payment.recipient;
    } catch (error: any) {
      if (error.response?.status === 402) {
        recipient = error.response.data.payment.recipient;
      } else {
        throw error;
      }
    }
    
    // Generate payment
    const paymentProof = await generatePaymentProof(amount, recipient);
    
    // Make paid request
    const response = await axios.get(`${API_URL}${endpoint}`, {
      headers: { 'X-Payment': paymentProof }
    });
    
    if (response.data.success && response.data.data) {
      const data = response.data.data;
      const actualKeys = Object.keys(data);
      
      console.log(`   ✓ Response received`);
      console.log(`   📊 Data structure keys:`, actualKeys);
      
      // Check for expected enhanced keys
      const missingKeys = expectedKeys.filter(key => !hasNestedKey(data, key));
      const extraKeys = actualKeys.filter(key => !expectedKeys.includes(key));
      
      if (missingKeys.length === 0) {
        console.log(`   ✅ All expected keys present`);
        return { success: true, data };
      } else {
        console.log(`   ⚠️  Missing keys:`, missingKeys);
        console.log(`   ℹ️  Extra keys:`, extraKeys);
        return { success: false, missingKeys, extraKeys, data };
      }
    } else {
      console.log(`   ❌ Failed to get data`);
      return { success: false, error: 'No data returned' };
    }
  } catch (error: any) {
    console.log(`   ❌ Error:`, error.message);
    return { success: false, error: error.message };
  }
}

function hasNestedKey(obj: any, path: string): boolean {
  const keys = path.split('.');
  let current = obj;
  
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return false;
    }
  }
  
  return true;
}

async function main() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║   PayPerAgent Enhanced API Structure Testing              ║');
  console.log('║   Verifying comprehensive data structures                 ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  
  const tests = [
    {
      name: 'Weather API',
      endpoint: '/api/weather?city=London',
      amount: '0.001',
      expectedKeys: ['location', 'country', 'timezone', 'coordinates', 'current', 'weather', 'wind', 'clouds', 'sun', 'dt']
    },
    {
      name: 'Crypto API',
      endpoint: '/api/crypto?symbol=BTCUSDT',
      amount: '0.002',
      expectedKeys: ['btc.symbol', 'btc.price', 'btc.orderbook', 'btc.volume', 'btc.timestamps']
    },
    {
      name: 'News API',
      endpoint: '/api/news?category=technology&pageSize=3',
      amount: '0.005',
      expectedKeys: ['totalResults', 'query', 'category', 'country', 'articles']
    },
    {
      name: 'Wikipedia API',
      endpoint: '/api/wikipedia/search?query=blockchain&limit=3',
      amount: '0.002',
      expectedKeys: ['query', 'results', 'count', 'metadata']
    },
    {
      name: 'Ruby.Exchange API',
      endpoint: '/api/ruby/price?token=RUBY',
      amount: '0.001',
      expectedKeys: ['success', 'token', 'pair', 'price', 'volume', 'liquidity', 'blockchain', 'metadata']
    },
    {
      name: 'Chirper.ai API',
      endpoint: '/api/chirper/trending',
      amount: '0.003',
      expectedKeys: ['trending', 'network', 'analytics', 'metadata']
    }
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    const result = await testEnhancedAPI(test.endpoint, test.amount, test.expectedKeys);
    if (result.success) {
      passed++;
    } else {
      failed++;
    }
  }
  
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║   Enhanced API Structure Test Results                     ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log(`✅ Passed: ${passed}/${tests.length}`);
  console.log(`❌ Failed: ${failed}/${tests.length}`);
  
  if (failed === 0) {
    console.log('\n🎉 All enhanced API structures verified!');
  } else {
    console.log('\n⚠️  Some API structures need review.');
  }
}

main().catch(console.error);
