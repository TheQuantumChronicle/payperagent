# Wallet Setup Instructions

Quick guide to export your MetaMask private key and complete the PayPerAgent setup.

---

## ✅ What You Have

- ✅ MetaMask installed
- ✅ SKALE Base Sepolia network added
- ✅ sFUEL tokens (for gas)
- ✅ 0.1 SKALE tokens

---

## 🔑 Export Private Key from MetaMask

### Step 1: Open MetaMask

1. Click MetaMask extension icon
2. Make sure you're on **SKALE Base Sepolia** network
3. Click the three dots (⋮) or account menu

### Step 2: Access Account Details

1. Click **"Account Details"**
2. You'll see your account name and address

### Step 3: Show Private Key

1. Click **"Show Private Key"** button
2. Enter your MetaMask password
3. Click **"Confirm"**

### Step 4: Copy Private Key

1. Click **"Copy to clipboard"** or manually copy the key
2. It will look like: `0x1234567890abcdef...` (64 characters after 0x)

---

## 📝 Update Your .env File

### Step 1: Open .env File

```bash
# In your project
cd ~/Desktop/payperagent/backend
open .env
```

### Step 2: Add Your Private Key

Find this line:
```env
PAYMENT_WALLET_PRIVATE_KEY=your_wallet_private_key_here
```

Replace with your actual private key:
```env
PAYMENT_WALLET_PRIVATE_KEY=0x1234567890abcdef...
```

### Step 3: Update Network Settings

Make sure these match SKALE Base Sepolia:
```env
SKALE_RPC_URL=https://base-sepolia-testnet.skalenodes.com/v1/jubilant-horrible-ancha
SKALE_CHAIN_ID=324705682
```

### Step 4: Save the File

**Important:** Make sure `.env` is in `.gitignore` (it already is!)

---

## 🔒 Security Checklist

- ✅ **Never share your private key** with anyone
- ✅ **Never commit .env to git** (already in .gitignore)
- ✅ **Use different wallets for dev/prod**
- ✅ **Keep testnet and mainnet keys separate**
- ✅ **Back up your seed phrase** (not private key) in secure location

---

## 🧪 Test Your Setup

### Run Connection Test

```bash
cd ~/Desktop/payperagent/backend
npx tsx test-skale-connection.ts
```

**Expected Output:**
```
🔍 Testing SKALE Network Connection...

Test 1: Network Information
✅ Connected to network
   Chain ID: 324705682
   RPC URL: https://base-sepolia-testnet.skalenodes.com/v1/jubilant-horrible-ancha

Test 2: Block Height
✅ Current block: 12345

Test 3: Latest Block Details
✅ Block hash: 0x...
   Timestamp: 2026-01-07T10:44:00.000Z
   Transactions: 5

Test 4: Wallet Information
✅ Wallet address: 0xYourAddress...
   sFUEL balance: 0.5 sFUEL
   ✅ Sufficient sFUEL for transactions

Test 5: Facilitator Connection
✅ Facilitator online: https://facilitator.dirtroad.dev

🎉 Connection Test Complete!
```

---

## 🚀 Start the Server

Once the test passes:

```bash
cd ~/Desktop/payperagent/backend
npm run dev
```

**Expected Output:**
```
🚀 PayPerAgent API Gateway running on port 3000
📡 Environment: development
⛓️  SKALE Network: https://base-sepolia-testnet.skalenodes.com/v1/jubilant-horrible-ancha
💰 x402 Payment Protocol: Enabled
🔒 Rate Limiting: 100 req/min, 1000 req/day per agent
```

---

## 🧪 Test the API

### Health Check
```bash
curl https://payperagent.xyz/health
```

### Gateway Info
```bash
curl https://payperagent.xyz/api
```

### Test Weather Endpoint (Will return 402)
```bash
curl https://payperagent.xyz/api/weather?city=London
```

**Expected:** 402 Payment Required response with payment details

---

## 🎯 What's Next?

After successful setup:

1. ✅ Server running
2. ✅ Wallet connected
3. ✅ Payment middleware working
4. ⏳ Need USDC for actual payments
5. ⏳ Test full payment flow with demo agent

---

## 🆘 Troubleshooting

### "Invalid private key" error
- Make sure key starts with `0x`
- Check for extra spaces or quotes
- Verify you copied the entire key (66 characters total)

### "Insufficient sFUEL" warning
- Visit: https://base-sepolia-faucet.skale.space
- Enter your wallet address
- Claim sFUEL (once per 24 hours)

### "Cannot connect to RPC" error
- Check RPC URL is correct
- Verify network is online (check explorer)
- Try restarting your terminal

### "Facilitator unreachable" warning
- This is usually fine (facilitator may not have /health endpoint)
- Will work when actual payments are made

---

## 📋 Your Current Configuration

**Network:** SKALE Base Sepolia Testnet  
**RPC:** https://base-sepolia-testnet.skalenodes.com/v1/jubilant-horrible-ancha  
**Chain ID:** 324705682  
**Explorer:** https://base-sepolia-testnet-explorer.skalenodes.com/  
**Faucet:** https://base-sepolia-faucet.skale.space  

**Tokens:**
- ✅ sFUEL (for gas)
- ✅ 0.1 SKALE tokens
- ⏳ USDC (for payments - coming next)

---

## 🎉 You're Almost Ready!

Once you complete these steps, your PayPerAgent gateway will be fully operational on SKALE Network with zero gas fees! 🚀
