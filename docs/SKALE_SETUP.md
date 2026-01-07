# SKALE Network Setup Guide

Complete guide for connecting PayPerAgent to SKALE Network with x402 payment protocol.

---

## Table of Contents

1. [Understanding SKALE](#understanding-skale)
2. [Network Options](#network-options)
3. [Setup Steps](#setup-steps)
4. [Configuration](#configuration)
5. [Testing Connection](#testing-connection)
6. [x402 Payment Integration](#x402-payment-integration)
7. [Troubleshooting](#troubleshooting)

---

## Understanding SKALE

### What is SKALE?

**SKALE** is a blockchain network purpose-built for the **Internet of Agents**, offering:

- ✅ **Zero Gas Fees** - No transaction costs using sFUEL
- ✅ **Instant Finality** - Transactions confirm immediately
- ✅ **EVM Compatible** - Works with all Ethereum tools
- ✅ **Infinite Scalability** - Dedicated compute resources
- ✅ **Private Execution** - Optional privacy features

### Key Concepts

**SKALE Chains (sChains):**
- Layer 1 blockchains (not rollups)
- Application-specific or shared resources
- Full EVM compatibility
- Dedicated validator sets

**sFUEL:**
- Gas token with **no monetary value**
- Cannot be bought or sold
- Free from faucets
- Used only for spam prevention

**x402 Protocol:**
- HTTP 402 "Payment Required" standard
- Enables paywalled APIs/resources
- Uses USDC for actual payments
- Zero gas fees on SKALE

---

## Network Options

SKALE offers two types of chains:

### 1. SKALE Base Chains
Built on Base L2 with native bridge to/from Base

#### SKALE Base Mainnet
```
RPC URL: https://skale-base.skalenodes.com/v1/base
Explorer: https://skale-base-explorer.skalenodes.com/
Portal: https://base.skalenodes.com/chains/base
```

#### SKALE Base Testnet (Recommended for Development)
```
RPC URL: https://base-sepolia-testnet.skalenodes.com/v1/jubilant-horrible-ancha
Explorer: https://base-sepolia-testnet-explorer.skalenodes.com/
Faucet: https://base-sepolia-faucet.skale.space
```

### 2. Ethereum-based Chains
Built on Ethereum with IMA bridge to/from Ethereum

#### Nebula Testnet (Currently Used in PayPerAgent)
```
RPC URL: https://testnet.skalenodes.com/v1/lanky-ill-funny-testnet
Chain ID: 1351057110
Explorer: https://lanky-ill-funny-testnet.explorer.testnet.skalenodes.com/
Portal: https://testnet.portal.skale.space/chains/nebula
```

#### Calypso Testnet
```
RPC URL: https://testnet.skalenodes.com/v1/giant-half-dual-testnet
Explorer: https://giant-half-dual.explorer.testnet.skalenodes.com/
Portal: https://testnet.portal.skale.space/chains/calypso
```

#### Europa Testnet
```
RPC URL: https://testnet.skalenodes.com/v1/juicy-low-small-testnet
Explorer: https://juicy-low-small-testnet.explorer.testnet.skalenodes.com/
Portal: https://testnet.portal.skale.space/chains/europa
```

---

## Setup Steps

### Step 1: Install MetaMask

1. Install [MetaMask browser extension](https://metamask.io)
2. Create new wallet or import existing
3. **Save your seed phrase securely!**

### Step 2: Add SKALE Network to MetaMask

#### Option A: Manual Configuration

1. Open MetaMask
2. Click network dropdown → "Add Network"
3. Enter network details:

**For Nebula Testnet:**
```
Network Name: SKALE Nebula Testnet
RPC URL: https://testnet.skalenodes.com/v1/lanky-ill-funny-testnet
Chain ID: 1351057110
Currency Symbol: sFUEL
Block Explorer: https://lanky-ill-funny-testnet.explorer.testnet.skalenodes.com/
```

**For SKALE Base Testnet:**
```
Network Name: SKALE Base Sepolia Testnet
RPC URL: https://base-sepolia-testnet.skalenodes.com/v1/jubilant-horrible-ancha
Chain ID: (auto-detected)
Currency Symbol: sFUEL
Block Explorer: https://base-sepolia-testnet-explorer.skalenodes.com/
```

#### Option B: Using SKALE Portal

1. Visit [SKALE Portal](https://portal.skale.space)
2. Connect your wallet
3. Browse available chains
4. Click "Add to MetaMask" on desired network

### Step 3: Get sFUEL (Free Gas Token)

sFUEL is required for transactions but has **no monetary value**.

#### For SKALE Base Testnet:
1. Visit [SKALE Base Faucet](https://base-sepolia-faucet.skale.space)
2. Enter your wallet address
3. Click "Get sFUEL"
4. Wait ~10 seconds
5. Check MetaMask balance

**Note:** You can only claim once every 24 hours.

#### For Nebula/Europa/Calypso Testnet:
1. Visit [sFUEL Station](https://sfuelstation.com)
2. Select your network
3. Enter wallet address
4. Claim sFUEL

### Step 4: Get Test USDC (For Payments)

USDC is the actual payment token used in x402 protocol.

**Important:** Test USDC addresses vary by network. Check the SKALE Portal for the correct token contract address.

#### Methods to Get Test USDC:

**Option 1: SKALE Faucet (if available)**
- Some testnets provide USDC faucets
- Check network-specific faucet pages

**Option 2: Bridge from Base Sepolia**
1. Get Base Sepolia testnet ETH
2. Get Base Sepolia USDC from faucet
3. Use SKALE Bridge to transfer to SKALE Base

**Option 3: Deploy Test Token (Advanced)**
- Deploy your own ERC20 token for testing
- Mint tokens to your wallet

### Step 5: Export Private Key

⚠️ **SECURITY WARNING:** Never share your private key or commit it to git!

1. Open MetaMask
2. Click account menu → "Account Details"
3. Click "Show Private Key"
4. Enter MetaMask password
5. Copy private key
6. Paste into `.env` file (see Configuration section)

---

## Configuration

### Update Your `.env` File

```bash
# SKALE Network Configuration
SKALE_RPC_URL=https://testnet.skalenodes.com/v1/lanky-ill-funny-testnet
SKALE_CHAIN_ID=1351057110

# Facilitator (Payment Verification Service)
FACILITATOR_URL=https://facilitator.dirtroad.dev

# Your Wallet Configuration
PAYMENT_WALLET_PRIVATE_KEY=your_private_key_here

# USDC Token Address on SKALE (check network-specific address)
PAYMENT_TOKEN_ADDRESS=0x... # Get from SKALE Portal or docs

# Payment Settings
MAX_AMOUNT_REQUIRED=1.5
PAYMENT_DESCRIPTION=PayPerAgent API Access
```

### Network-Specific Configuration

**For SKALE Base Testnet:**
```env
SKALE_RPC_URL=https://base-sepolia-testnet.skalenodes.com/v1/jubilant-horrible-ancha
SKALE_CHAIN_ID=auto
```

**For Nebula Testnet (Current):**
```env
SKALE_RPC_URL=https://testnet.skalenodes.com/v1/lanky-ill-funny-testnet
SKALE_CHAIN_ID=1351057110
```

### Understanding Configuration Values

**SKALE_RPC_URL:**
- Endpoint to connect to SKALE blockchain
- Different for each network
- Used by ethers.js to send transactions

**SKALE_CHAIN_ID:**
- Unique identifier for the blockchain
- Prevents transactions on wrong network
- Auto-detected by some tools

**FACILITATOR_URL:**
- Third-party service that verifies x402 payments
- Hosted by Dirt Road Dev (official)
- Handles payment verification without you running infrastructure

**PAYMENT_WALLET_PRIVATE_KEY:**
- Your wallet's private key
- Used to receive payments
- **NEVER share or commit to git!**

**PAYMENT_TOKEN_ADDRESS:**
- USDC contract address on SKALE
- Specifies which token agents pay with
- Network-specific (different per chain)

**MAX_AMOUNT_REQUIRED:**
- Maximum payment per request (in USDC)
- Safety limit to prevent overcharging
- Should be higher than your most expensive API

**PAYMENT_DESCRIPTION:**
- Human-readable description
- Shows in payment requests
- Helps agents understand what they're paying for

---

## Testing Connection

### Test 1: Check RPC Connection

Using `cast` from Foundry:

```bash
# Install Foundry (if not installed)
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Check block height
cast block-number --rpc-url https://testnet.skalenodes.com/v1/lanky-ill-funny-testnet
```

Expected output: A number (current block height)

### Test 2: Check Your Wallet Balance

```bash
# Check sFUEL balance
cast balance YOUR_WALLET_ADDRESS --rpc-url https://testnet.skalenodes.com/v1/lanky-ill-funny-testnet

# Check USDC balance (if you have the token address)
cast call USDC_TOKEN_ADDRESS "balanceOf(address)(uint256)" YOUR_WALLET_ADDRESS --rpc-url https://testnet.skalenodes.com/v1/lanky-ill-funny-testnet
```

### Test 3: Test from Your Application

Create a test script:

```typescript
// test-skale-connection.ts
import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
  const provider = new ethers.JsonRpcProvider(process.env.SKALE_RPC_URL);
  
  try {
    // Test 1: Get network info
    const network = await provider.getNetwork();
    console.log('✅ Connected to network:', network.name);
    console.log('   Chain ID:', network.chainId.toString());
    
    // Test 2: Get block number
    const blockNumber = await provider.getBlockNumber();
    console.log('✅ Current block:', blockNumber);
    
    // Test 3: Check wallet balance
    if (process.env.PAYMENT_WALLET_PRIVATE_KEY) {
      const wallet = new ethers.Wallet(
        process.env.PAYMENT_WALLET_PRIVATE_KEY,
        provider
      );
      const balance = await provider.getBalance(wallet.address);
      console.log('✅ Wallet address:', wallet.address);
      console.log('   sFUEL balance:', ethers.formatEther(balance));
    }
    
    console.log('\n🎉 All tests passed! SKALE connection working.');
  } catch (error) {
    console.error('❌ Connection failed:', error);
  }
}

testConnection();
```

Run it:
```bash
npx tsx test-skale-connection.ts
```

---

## x402 Payment Integration

### How x402 Works in PayPerAgent

```
┌─────────────────────────────────────────────────────────┐
│                    Payment Flow                         │
└─────────────────────────────────────────────────────────┘

1. Agent → GET /api/weather?city=London
   (No payment header)
   
2. Gateway → x402 Middleware checks for X-PAYMENT header
   
3. Middleware → Calls facilitator /accepts endpoint
   Returns payment requirements
   
4. Gateway → 402 Payment Required
   {
     "facilitatorURL": "https://facilitator.dirtroad.dev",
     "accepts": [{
       "scheme": "exact",
       "network": "nebula-testnet",
       "maxAmountRequired": "0.001",
       "description": "Weather API access"
     }]
   }
   
5. Agent → Generates payment on SKALE
   - Creates USDC transfer transaction
   - Signs with private key
   - Zero gas fees!
   
6. Agent → Retries request with X-PAYMENT header
   GET /api/weather?city=London
   X-PAYMENT: <payment_proof>
   
7. Middleware → Calls facilitator /settle endpoint
   Verifies payment on blockchain
   
8. Facilitator → Checks SKALE blockchain
   Confirms USDC transfer
   
9. Gateway → Payment valid! Calls OpenWeather API
   
10. Agent ← Receives weather data
    You earned 0.001 USDC!
```

### Middleware Configuration

Your current setup in `src/middleware/x402.ts`:

```typescript
import { express } from '@faremeter/middleware';
import { skaleConfig } from '../config/skale';

export const createX402Middleware = async (options: X402Options) => {
  const middleware = await express.createMiddleware({
    facilitatorURL: skaleConfig.facilitatorUrl,
    accepts: [
      {
        scheme: 'exact',
        network: options.network || skaleConfig.network,
        maxAmountRequired: options.maxAmountRequired,
        description: options.description,
      },
    ],
  });

  return middleware;
};
```

### Network Names for x402

Use these network identifiers in your middleware:

**Testnet Networks:**
- `skale-base-sepolia` - SKALE Base Testnet
- `nebula-testnet` - Nebula Testnet (current)
- `calypso-testnet` - Calypso Testnet
- `europa-testnet` - Europa Testnet

**Mainnet Networks:**
- `skale-base` - SKALE Base Mainnet
- `nebula-mainnet` - Nebula Mainnet
- `calypso-mainnet` - Calypso Mainnet
- `europa-mainnet` - Europa Mainnet

### Update Your Config

Edit `backend/src/config/skale.ts`:

```typescript
export const skaleConfig = {
  rpcUrl: process.env.SKALE_RPC_URL || 'https://testnet.skalenodes.com/v1/lanky-ill-funny-testnet',
  chainId: parseInt(process.env.SKALE_CHAIN_ID || '1351057110'),
  facilitatorUrl: process.env.FACILITATOR_URL || 'https://facilitator.dirtroad.dev',
  network: 'nebula-testnet', // Add this line
};
```

---

## Troubleshooting

### Issue: "Cannot connect to RPC"

**Solutions:**
1. Check RPC URL is correct
2. Verify network is online (check explorer)
3. Try alternative RPC endpoints
4. Check firewall/proxy settings

### Issue: "Insufficient sFUEL"

**Solutions:**
1. Visit faucet and claim sFUEL
2. Wait 24 hours if recently claimed
3. Try different faucet (sfuelstation.com)
4. Ask in SKALE Discord for help

### Issue: "Payment verification failed"

**Solutions:**
1. Check USDC token address is correct
2. Verify you have USDC balance
3. Ensure facilitator URL is correct
4. Check network name matches in middleware
5. Verify wallet has sFUEL for transactions

### Issue: "Private key invalid"

**Solutions:**
1. Re-export from MetaMask
2. Remove any spaces or quotes
3. Ensure it starts with "0x"
4. Check it's the right account

### Issue: "402 error but payment sent"

**Solutions:**
1. Check payment cache settings
2. Verify facilitator is responding
3. Check SKALE blockchain explorer for transaction
4. Ensure network name matches exactly

---

## Best Practices

### Security

1. ✅ **Never commit `.env` to git**
2. ✅ **Use different wallets for dev/prod**
3. ✅ **Rotate keys regularly**
4. ✅ **Monitor wallet balance**
5. ✅ **Use hardware wallet for mainnet**

### Performance

1. ✅ **Enable payment caching** (30s TTL)
2. ✅ **Use connection pooling**
3. ✅ **Monitor facilitator uptime**
4. ✅ **Implement retry logic**
5. ✅ **Cache RPC responses**

### Cost Optimization

1. ✅ **Zero gas fees on SKALE** (no optimization needed!)
2. ✅ **Batch requests when possible**
3. ✅ **Use appropriate payment amounts**
4. ✅ **Monitor USDC balance**

---

## Next Steps

1. ✅ **Complete this setup guide**
2. ⏳ **Test connection with script**
3. ⏳ **Get sFUEL from faucet**
4. ⏳ **Get test USDC**
5. ⏳ **Start server and test 402 flow**
6. ⏳ **Deploy to testnet**
7. ⏳ **Test with demo agent**
8. ⏳ **Move to mainnet**

---

## Resources

### Official Links

- **SKALE Docs:** https://docs.skale.space
- **SKALE Portal:** https://portal.skale.space
- **SKALE Discord:** https://discord.gg/skale
- **SKALE Forum:** https://forum.skale.network
- **GitHub:** https://github.com/skalenetwork

### Tools

- **Block Explorers:** Network-specific (see Network Options)
- **Faucets:** https://sfuelstation.com
- **Bridge:** https://portal.skale.space/bridge
- **Foundry:** https://getfoundry.sh

### Support

- **Discord:** Best for quick help
- **Forum:** For detailed discussions
- **GitHub Issues:** For bug reports
- **Email:** support@skale.network

---

## Summary

**SKALE Network provides:**
- ✅ Zero gas fees (sFUEL is free)
- ✅ Instant finality
- ✅ EVM compatibility
- ✅ Perfect for AI agents
- ✅ x402 payment protocol

**Your PayPerAgent setup:**
- ✅ Connected to Nebula Testnet
- ✅ Using official facilitator
- ✅ Accepting USDC payments
- ✅ Zero gas fees for all transactions
- ✅ Ready for agent economy

**You're building infrastructure for the Internet of Agents! 🚀**
