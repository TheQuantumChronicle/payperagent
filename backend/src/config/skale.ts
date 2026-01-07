import { ethers } from 'ethers';

export const skaleConfig = {
  rpcUrl: process.env.SKALE_RPC_URL || 'https://base-sepolia-testnet.skalenodes.com/v1/jubilant-horrible-ancha',
  chainId: parseInt(process.env.SKALE_CHAIN_ID || '324705682'),
  facilitatorUrl: process.env.FACILITATOR_URL || 'https://facilitator.dirtroad.dev',
  network: 'skale-base-sepolia',
};

export const getProvider = () => {
  return new ethers.JsonRpcProvider(skaleConfig.rpcUrl);
};

export const getWallet = () => {
  const privateKey = process.env.PAYMENT_WALLET_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error('PAYMENT_WALLET_PRIVATE_KEY not set in environment');
  }
  return new ethers.Wallet(privateKey, getProvider());
};
