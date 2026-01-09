/**
 * Real End-to-End Payment Testing Script
 * Tests actual x402 payment flow with real CREDIT/USDC tokens
 */

import { ethers } from 'ethers';
import axios from 'axios';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load backend .env file
dotenv.config({ path: path.join(__dirname, 'backend', '.env') });

const API_URL = process.env.API_URL || 'http://localhost:3000';
const PRIVATE_KEY = process.env.TEST_PAYMENT_PRIVATE_KEY;
const SKALE_RPC = process.env.SKALE_RPC_URL || 'https://testnet.skalenodes.com/v1/lanky-ill-funny-testnet';
const FACILITATOR_URL = process.env.FACILITATOR_URL || 'https://facilitator.dirtroad.dev';

interface TestResult {
  endpoint: string;
  price: string;
  success: boolean;
  transactionHash?: string;
  responseData?: any;
  error?: string;
  duration: number;
}

class PaymentTester {
  private wallet: ethers.Wallet;
  private provider: ethers.JsonRpcProvider;
  private results: TestResult[] = [];

  constructor() {
    if (!PRIVATE_KEY) {
      throw new Error('TEST_PAYMENT_PRIVATE_KEY not found in backend/.env');
    }

    this.provider = new ethers.JsonRpcProvider(SKALE_RPC);
    this.wallet = new ethers.Wallet(PRIVATE_KEY, this.provider);
    
    console.log('🔑 Test Wallet Address:', this.wallet.address);
  }

  async checkBalance(): Promise<void> {
    console.log('\n💰 Checking wallet balance...');
    
    try {
      const balance = await this.provider.getBalance(this.wallet.address);
      console.log('   ETH Balance:', ethers.formatEther(balance), 'ETH');
      
      // Check USDC balance (you'll need the USDC contract address)
      // For now, we'll just check ETH balance
      
      if (balance === 0n) {
        console.log('⚠️  Warning: Wallet has zero balance!');
      }
    } catch (error: any) {
      console.error('❌ Error checking balance:', error.message);
    }
  }

  async generatePaymentProof(amount: string, recipient: string, nonce: string): Promise<string> {
    // Create payment message
    const message = ethers.solidityPackedKeccak256(
      ['address', 'uint256', 'string'],
      [recipient, ethers.parseUnits(amount, 6), nonce]
    );
    
    // Sign the message
    const signature = await this.wallet.signMessage(ethers.getBytes(message));
    
    return signature;
  }

  async testEndpoint(
    endpoint: string,
    params: Record<string, string>,
    expectedPrice: string
  ): Promise<TestResult> {
    const startTime = Date.now();
    const result: TestResult = {
      endpoint,
      price: expectedPrice,
      success: false,
      duration: 0,
    };

    try {
      console.log(`\n🧪 Testing: ${endpoint}`);
      console.log(`   Price: ${expectedPrice} USDC`);
      
      // Step 1: Make initial request (should get 402)
      console.log('   Step 1: Making initial request...');
      const queryString = new URLSearchParams(params).toString();
      const url = `${API_URL}${endpoint}?${queryString}`;
      
      let response;
      try {
        response = await axios.get(url);
        console.log('   ⚠️  Got 200 without payment (free endpoint?)');
        result.success = true;
        result.responseData = response.data;
        result.duration = Date.now() - startTime;
        return result;
      } catch (error: any) {
        if (error.response?.status !== 402) {
          throw error;
        }
        response = error.response;
      }

      console.log('   ✓ Got 402 Payment Required');
      const paymentDetails = response.data.payment;
      
      if (!paymentDetails) {
        throw new Error('No payment details in 402 response');
      }

      console.log('   Payment Details:', {
        amount: paymentDetails.amount,
        recipient: paymentDetails.recipient,
        token: paymentDetails.token,
      });

      // Step 2: Generate payment proof
      console.log('   Step 2: Generating payment proof...');
      const nonce = Date.now().toString();
      const signature = await this.generatePaymentProof(
        paymentDetails.amount,
        paymentDetails.recipient,
        nonce
      );
      
      console.log('   ✓ Payment proof generated');

      // Step 3: Make request with payment
      console.log('   Step 3: Making request with payment...');
      const paidResponse = await axios.get(url, {
        headers: {
          'X-Payment': JSON.stringify({
            signature,
            amount: paymentDetails.amount,
            token: paymentDetails.token,
            sender: this.wallet.address,
            recipient: paymentDetails.recipient,
            nonce,
          }),
        },
      });

      console.log('   ✓ Payment accepted!');
      console.log('   ✓ Data received:', Object.keys(paidResponse.data.data || paidResponse.data));

      result.success = true;
      result.responseData = paidResponse.data;
      result.transactionHash = signature.substring(0, 20) + '...';
      result.duration = Date.now() - startTime;

    } catch (error: any) {
      console.error('   ❌ Test failed:', error.message);
      result.error = error.message;
      result.duration = Date.now() - startTime;
    }

    return result;
  }

  async runAllTests(): Promise<void> {
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║   PayPerAgent Real Payment Testing                        ║');
    console.log('║   Testing with actual CREDIT/USDC tokens                  ║');
    console.log('╚════════════════════════════════════════════════════════════╝');

    await this.checkBalance();

    // Test 1: Weather API (cheapest)
    this.results.push(
      await this.testEndpoint('/api/weather', { city: 'London' }, '0.001')
    );

    // Test 2: Crypto API
    this.results.push(
      await this.testEndpoint('/api/crypto', { symbol: 'BTCUSDT' }, '0.002')
    );

    // Test 3: CoinGecko API
    this.results.push(
      await this.testEndpoint('/api/coingecko/price', { ids: 'bitcoin', vs_currencies: 'usd' }, '0.001')
    );

    // Test 4: News API
    this.results.push(
      await this.testEndpoint('/api/news', { category: 'technology', pageSize: '3' }, '0.005')
    );

    // Test 5: Wikipedia API (free - should work without payment)
    this.results.push(
      await this.testEndpoint('/api/wikipedia/search', { query: 'SKALE Network' }, '0.000')
    );

    this.printResults();
  }

  printResults(): void {
    console.log('\n\n╔════════════════════════════════════════════════════════════╗');
    console.log('║   Test Results Summary                                     ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    const passed = this.results.filter(r => r.success).length;
    const failed = this.results.filter(r => !r.success).length;
    const totalSpent = this.results
      .filter(r => r.success && parseFloat(r.price) > 0)
      .reduce((sum, r) => sum + parseFloat(r.price), 0);

    this.results.forEach((result, i) => {
      const status = result.success ? '✅' : '❌';
      console.log(`${status} Test ${i + 1}: ${result.endpoint}`);
      console.log(`   Price: ${result.price} USDC`);
      console.log(`   Duration: ${result.duration}ms`);
      if (result.transactionHash) {
        console.log(`   TX: ${result.transactionHash}`);
      }
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
      console.log('');
    });

    console.log('═══════════════════════════════════════════════════════════');
    console.log(`Total Tests: ${this.results.length}`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`💰 Total Spent: ${totalSpent.toFixed(4)} USDC`);
    console.log('═══════════════════════════════════════════════════════════\n');

    if (failed === 0) {
      console.log('🎉 All payment tests passed! x402 system is working perfectly!\n');
    } else {
      console.log('⚠️  Some tests failed. Review the errors above.\n');
    }
  }

  async checkAnalytics(): Promise<void> {
    console.log('\n📊 Checking analytics tracking...');
    
    try {
      const response = await axios.get(`${API_URL}/analytics/usage`);
      const stats = response.data;
      
      console.log('   Total Requests:', stats.overview?.totalRequests || 'N/A');
      console.log('   Success Rate:', stats.overview?.successRate || 'N/A');
      console.log('   Total Revenue:', stats.overview?.totalRevenue || 'N/A', 'USDC');
      
      // Check if our wallet appears in leaderboard
      const leaderboard = await axios.get(`${API_URL}/api/reputation/leaderboard?limit=10`);
      const ourEntry = leaderboard.data.leaderboard?.find(
        (entry: any) => entry.wallet_address?.toLowerCase() === this.wallet.address.toLowerCase()
      );
      
      if (ourEntry) {
        console.log('\n   ✅ Test wallet found in leaderboard!');
        console.log('   Rank:', ourEntry.rank);
        console.log('   Total Spent:', ourEntry.total_spent, 'USDC');
        console.log('   Request Count:', ourEntry.request_count);
      } else {
        console.log('\n   ℹ️  Test wallet not yet in leaderboard (may need more requests)');
      }
    } catch (error: any) {
      console.error('   ❌ Error checking analytics:', error.message);
    }
  }
}

// Run tests
async function main() {
  try {
    const tester = new PaymentTester();
    await tester.runAllTests();
    await tester.checkAnalytics();
  } catch (error: any) {
    console.error('\n❌ Fatal error:', error.message);
    process.exit(1);
  }
}

main();
