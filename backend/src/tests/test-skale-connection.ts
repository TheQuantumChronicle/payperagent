import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
  console.log('🔍 Testing SKALE Network Connection...\n');

  const rpcUrl = process.env.SKALE_RPC_URL || 'https://base-sepolia-testnet.skalenodes.com/v1/jubilant-horrible-ancha';
  const provider = new ethers.JsonRpcProvider(rpcUrl);

  try {
    // Test 1: Get network info
    console.log('Test 1: Network Information');
    const network = await provider.getNetwork();
    console.log('✅ Connected to network');
    console.log(`   Chain ID: ${network.chainId.toString()}`);
    console.log(`   RPC URL: ${rpcUrl}\n`);

    // Test 2: Get block number
    console.log('Test 2: Block Height');
    const blockNumber = await provider.getBlockNumber();
    console.log(`✅ Current block: ${blockNumber}\n`);

    // Test 3: Get latest block
    console.log('Test 3: Latest Block Details');
    const block = await provider.getBlock('latest');
    if (block) {
      console.log(`✅ Block hash: ${block.hash}`);
      console.log(`   Timestamp: ${new Date(block.timestamp * 1000).toISOString()}`);
      console.log(`   Transactions: ${block.transactions.length}\n`);
    }

    // Test 4: Check wallet balance (if private key provided)
    if (process.env.PAYMENT_WALLET_PRIVATE_KEY) {
      console.log('Test 4: Wallet Information');
      try {
        const wallet = new ethers.Wallet(
          process.env.PAYMENT_WALLET_PRIVATE_KEY,
          provider
        );
        const balance = await provider.getBalance(wallet.address);
        console.log(`✅ Wallet address: ${wallet.address}`);
        console.log(`   sFUEL balance: ${ethers.formatEther(balance)} sFUEL`);
        
        // Check if balance is sufficient
        if (balance > 0n) {
          console.log('   ✅ Sufficient sFUEL for transactions\n');
        } else {
          console.log('   ⚠️  No sFUEL - get from faucet: https://base-sepolia-faucet.skale.space\n');
        }
      } catch (error: any) {
        console.log(`❌ Wallet error: ${error.message}\n`);
      }
    } else {
      console.log('Test 4: Wallet Information');
      console.log('⏭️  Skipped - PAYMENT_WALLET_PRIVATE_KEY not set\n');
    }

    // Test 5: Check facilitator
    console.log('Test 5: Facilitator Connection');
    const facilitatorUrl = process.env.FACILITATOR_URL || 'https://facilitator.dirtroad.dev';
    try {
      const response = await fetch(`${facilitatorUrl}/health`);
      if (response.ok) {
        console.log(`✅ Facilitator online: ${facilitatorUrl}\n`);
      } else {
        console.log(`⚠️  Facilitator returned status: ${response.status}\n`);
      }
    } catch (error) {
      console.log(`⚠️  Could not reach facilitator (may not have /health endpoint)\n`);
    }

    // Summary
    console.log('═══════════════════════════════════════════════════════');
    console.log('🎉 Connection Test Complete!');
    console.log('═══════════════════════════════════════════════════════');
    console.log('✅ SKALE Network: Connected');
    console.log('✅ RPC Endpoint: Working');
    console.log('✅ Block Data: Accessible');
    if (process.env.PAYMENT_WALLET_PRIVATE_KEY) {
      console.log('✅ Wallet: Configured');
    } else {
      console.log('⏳ Wallet: Not configured (add PAYMENT_WALLET_PRIVATE_KEY to .env)');
    }
    console.log('═══════════════════════════════════════════════════════\n');

    console.log('📋 Next Steps:');
    if (!process.env.PAYMENT_WALLET_PRIVATE_KEY) {
      console.log('1. Export private key from MetaMask');
      console.log('2. Add to .env: PAYMENT_WALLET_PRIVATE_KEY=your_key_here');
      console.log('3. Run this test again');
    } else {
      console.log('1. Start the server: npm run dev');
      console.log('2. Test endpoints: curl http://localhost:3000/health');
      console.log('3. Test payment flow with demo agent');
    }

  } catch (error: any) {
    console.error('❌ Connection Test Failed!\n');
    console.error('Error:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Check RPC URL is correct in .env');
    console.error('2. Verify network is online (check explorer)');
    console.error('3. Check internet connection');
    console.error('4. Try alternative RPC endpoint');
    process.exit(1);
  }
}

testConnection();
