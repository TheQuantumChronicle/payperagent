# SKALE Network Configuration Guide

Complete guide to SKALE Network chains and configuration for PayPerAgent.

## 🌐 SKALE Network Architecture

SKALE Network consists of:
1. **4 Public Hub Chains (Mainnet)** - Shared chains for specific use cases
2. **Chaos Testnet** - Free development chain
3. **Custom SKALE Chains** - Private chains for individual projects

### Understanding SKALE Hubs vs Custom Chains

**SKALE Hubs** are shared, public SKALE chains designed for specific industries:
- **Europa Hub**: DeFi & Liquidity (main entry point)
- **Calypso Hub**: NFT marketplace and trading
- **Nebula Hub**: Gaming applications
- **Titan Hub**: Community projects (DAOs, identity, social)

**Custom Chains** are private SKALE chains deployed for individual projects. These have unique names like "jubilant-horrible-ancha" and are NOT part of the public Hub ecosystem.

---

## Network Types

SKALE Chains are built on different base networks:

- **Base chains:** Built on Base L2 with native bridge to/from Base
- **Ethereum chains:** Built on Ethereum with IMA (SKALE Interchain Messaging Agent) bridge to/from Ethereum

---

## SKALE Base Chains

Built on Base L2 with native bridge to/from Base

### SKALE Base Mainnet

| Property | Value |
|----------|-------|
| **Network Name** | SKALE Base |
| **RPC URL** | https://skale-base.skalenodes.com/v1/base |
| **WSS URL** | wss://skale-base.skalenodes.com/v1/ws/base |
| **Chain ID** | 1187947933 |
| **Chain ID (Hex)** | 0x46cea59d |
| **Explorer** | https://skale-base-explorer.skalenodes.com/ |
| **Portal** | https://base.skalenodes.com/chains/base |

### SKALE Base Testnet ✅ (Currently Using)

| Property | Value |
|----------|-------|
| **Network Name** | SKALE Base Sepolia |
| **RPC URL** | https://base-sepolia-testnet.skalenodes.com/v1/jubilant-horrible-ancha |
| **Chain ID** | 324705682 |
| **Chain ID (Hex)** | 0x135A9D92 |
| **Explorer** | https://base-sepolia-testnet-explorer.skalenodes.com/ |
| **Faucet** | https://base-sepolia-faucet.skale.space |
| **Currency** | sFUEL + SKALE tokens |

**Status:** ✅ Connected - 0.1 SKALE tokens + sFUEL obtained

---

## Ethereum-based Chains

Built on Ethereum with IMA (Interchain Messaging Agent) bridge to/from Ethereum

### Calypso Mainnet

| Property | Value |
|----------|-------|
| **Network Name** | Calypso Hub |
| **RPC URL** | https://mainnet.skalenodes.com/v1/honorable-steel-rasalhague |
| **Chain ID** | 1564830818 |
| **Explorer** | https://honorable-steel-rasalhague.explorer.mainnet.skalenodes.com/ |
| **Portal** | https://portal.skale.space/chains/calypso |

### Calypso Testnet

| Property | Value |
|----------|-------|
| **Network Name** | Calypso Testnet |
| **RPC URL** | https://testnet.skalenodes.com/v1/giant-half-dual-testnet |
| **Chain ID** | 974399131 |
| **Explorer** | https://giant-half-dual.explorer.testnet.skalenodes.com/ |
| **Portal** | https://testnet.portal.skale.space/chains/calypso |

### Europa Mainnet

| Property | Value |
|----------|-------|
| **Network Name** | Europa Hub |
| **RPC URL** | https://mainnet.skalenodes.com/v1/elated-tan-skat |
| **Chain ID** | 2046399126 |
| **Explorer** | https://elated-tan-skat.explorer.mainnet.skalenodes.com/ |
| **Portal** | https://portal.skale.space/chains/europa |

### Europa Testnet

| Property | Value |
|----------|-------|
| **Network Name** | Europa Testnet |
| **RPC URL** | https://testnet.skalenodes.com/v1/juicy-low-small-testnet |
| **Chain ID** | 1444673419 |
| **Explorer** | https://juicy-low-small-testnet.explorer.testnet.skalenodes.com/ |
| **Portal** | https://testnet.portal.skale.space/chains/europa |

### Nebula Mainnet

| Property | Value |
|----------|-------|
| **Network Name** | Nebula Hub |
| **RPC URL** | https://mainnet.skalenodes.com/v1/green-giddy-denebola |
| **Chain ID** | 1482601649 |
| **Explorer** | https://green-giddy-denebola.explorer.mainnet.skalenodes.com/ |
| **Portal** | https://portal.skale.space/chains/nebula |

### Nebula Testnet

| Property | Value |
|----------|-------|
| **Network Name** | Nebula Testnet |
| **RPC URL** | https://testnet.skalenodes.com/v1/lanky-ill-funny-testnet |
| **Chain ID** | 37084624 |
| **Explorer** | https://lanky-ill-funny-testnet.explorer.testnet.skalenodes.com/ |
| **Portal** | https://testnet.portal.skale.space/chains/nebula |

---

## Network Selection for PayPerAgent

### Current Configuration: SKALE Base Sepolia Testnet ✅

**Why this network:**
- ✅ Active faucet with SKALE tokens
- ✅ Built on Base L2 (modern architecture)
- ✅ Native bridge to Base
- ✅ Good for testing x402 payments
- ✅ Well-documented and supported

**Tokens obtained:**
- sFUEL: ✅ (for gas)
- SKALE tokens: ✅ 0.1 tokens

### Alternative: Nebula Testnet

**Previously configured:**
- RPC: `https://testnet.skalenodes.com/v1/lanky-ill-funny-testnet`
- Chain ID: `37084624` (not 1351057110 as previously noted)
- Built on Ethereum (older architecture)

---

## Quick Reference

### For MetaMask Configuration

**SKALE Base Sepolia (Recommended):**
```
Network Name: SKALE Base Sepolia
RPC URL: https://base-sepolia-testnet.skalenodes.com/v1/jubilant-horrible-ancha
Chain ID: 324705682
Currency Symbol: sFUEL
Block Explorer: https://base-sepolia-testnet-explorer.skalenodes.com/
```

### For x402 Middleware

**Network identifier for SKALE Base Sepolia:**
```typescript
network: 'skale-base-sepolia'
```

### For Environment Variables

```env
SKALE_RPC_URL=https://base-sepolia-testnet.skalenodes.com/v1/jubilant-horrible-ancha
SKALE_CHAIN_ID=324705682
```

---

## Bridge Information

### SKALE Base Chains
- Bridge to/from: **Base L2**
- Mechanism: Native bridge
- Portal: https://base.skalenodes.com

### Ethereum-based Chains
- Bridge to/from: **Ethereum Mainnet**
- Mechanism: IMA (Interchain Messaging Agent)
- Portal: https://portal.skale.space/bridge

---

## Faucets

| Network | Faucet URL | Tokens |
|---------|-----------|--------|
| SKALE Base Sepolia | https://base-sepolia-faucet.skale.space | sFUEL + SKALE |
| All Networks | https://sfuelstation.com | sFUEL only |

**Limits:** Once per 24 hours per address

---

## Status

- ✅ **SKALE Base Sepolia connected**
- ✅ **sFUEL obtained**
- ✅ **0.1 SKALE tokens obtained**
- ⏳ **Need to find USDC contract address**
- ⏳ **Need to export wallet private key**
- ⏳ **Need to update .env configuration**

---

## Next Steps

1. Find USDC token contract address on SKALE Base Sepolia
2. Export wallet private key from MetaMask
3. Update `.env` with correct network configuration
4. Update `skale.ts` config with network name
5. Test connection with test script
6. Start server and verify 402 payment flow
