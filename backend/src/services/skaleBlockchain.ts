import { ethers } from 'ethers';

// SKALE Network Configuration
export const SKALE_CHAINS = {
  NEBULA_TESTNET: {
    name: 'SKALE Nebula Hub Testnet',
    chainId: 37084624,
    rpc: 'https://testnet.skalenodes.com/v1/lanky-ill-funny-testnet',
    explorer: 'https://lanky-ill-funny-testnet.explorer.testnet.skalenodes.com',
    nativeCurrency: {
      name: 'sFUEL',
      symbol: 'sFUEL',
      decimals: 18
    }
  },
  EUROPA_HUB: {
    name: 'SKALE Europa Hub',
    chainId: 2046399126,
    rpc: 'https://mainnet.skalenodes.com/v1/elated-tan-skat',
    explorer: 'https://elated-tan-skat.explorer.mainnet.skalenodes.com',
    nativeCurrency: {
      name: 'sFUEL',
      symbol: 'sFUEL',
      decimals: 18
    }
  },
  CALYPSO_HUB: {
    name: 'SKALE Calypso Hub',
    chainId: 1564830818,
    rpc: 'https://mainnet.skalenodes.com/v1/honorable-steel-rasalhague',
    explorer: 'https://honorable-steel-rasalhague.explorer.mainnet.skalenodes.com',
    nativeCurrency: {
      name: 'sFUEL',
      symbol: 'sFUEL',
      decimals: 18
    }
  }
};

// Ruby.Exchange Contract Addresses (Europa Hub)
export const RUBY_CONTRACTS = {
  ROUTER: '0x...', // Ruby Router contract
  FACTORY: '0x...', // Ruby Factory contract
  RUBY_TOKEN: '0x918D8F3670c67f14Ff3fEB025D46B9C165d12a23', // RUBY token on Ethereum mainnet
  // Add more as we find them
};

// Chirper.ai Contract Addresses
export const CHIRPER_CONTRACTS = {
  MAIN: '0x...', // Chirper main contract
  // Add more as we find them
};

// Create provider for SKALE Network
export function createSkaleProvider(chain: keyof typeof SKALE_CHAINS = 'EUROPA_HUB'): ethers.JsonRpcProvider {
  const config = SKALE_CHAINS[chain];
  return new ethers.JsonRpcProvider(config.rpc, {
    chainId: config.chainId,
    name: config.name
  });
}

// Get block number
export async function getBlockNumber(chain: keyof typeof SKALE_CHAINS = 'EUROPA_HUB'): Promise<number> {
  const provider = createSkaleProvider(chain);
  return await provider.getBlockNumber();
}

// Get gas price (should be 0 on SKALE)
export async function getGasPrice(chain: keyof typeof SKALE_CHAINS = 'EUROPA_HUB'): Promise<bigint> {
  const provider = createSkaleProvider(chain);
  const feeData = await provider.getFeeData();
  return feeData.gasPrice || 0n;
}

// Get account balance
export async function getBalance(address: string, chain: keyof typeof SKALE_CHAINS = 'EUROPA_HUB'): Promise<string> {
  const provider = createSkaleProvider(chain);
  const balance = await provider.getBalance(address);
  return ethers.formatEther(balance);
}

// Generic contract call
export async function callContract(
  contractAddress: string,
  abi: any[],
  method: string,
  params: any[] = [],
  chain: keyof typeof SKALE_CHAINS = 'EUROPA_HUB'
): Promise<any> {
  const provider = createSkaleProvider(chain);
  const contract = new ethers.Contract(contractAddress, abi, provider);
  return await contract[method](...params);
}

// ERC20 Token ABI (minimal)
export const ERC20_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function transferFrom(address from, address to, uint256 amount) returns (bool)'
];

// Uniswap V2 Pair ABI (for DEX data)
export const UNISWAP_V2_PAIR_ABI = [
  'function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)',
  'function token0() view returns (address)',
  'function token1() view returns (address)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address) view returns (uint256)'
];

// Uniswap V2 Router ABI (for swap quotes)
export const UNISWAP_V2_ROUTER_ABI = [
  'function getAmountsOut(uint amountIn, address[] memory path) view returns (uint[] memory amounts)',
  'function getAmountsIn(uint amountOut, address[] memory path) view returns (uint[] memory amounts)',
  'function factory() view returns (address)',
  'function WETH() view returns (address)'
];

// Helper: Get token info
export async function getTokenInfo(
  tokenAddress: string,
  chain: keyof typeof SKALE_CHAINS = 'EUROPA_HUB'
): Promise<{ name: string; symbol: string; decimals: number; totalSupply: string }> {
  const provider = createSkaleProvider(chain);
  const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
  
  const [name, symbol, decimals, totalSupply] = await Promise.all([
    contract.name(),
    contract.symbol(),
    contract.decimals(),
    contract.totalSupply()
  ]);
  
  return {
    name,
    symbol,
    decimals: Number(decimals),
    totalSupply: ethers.formatUnits(totalSupply, decimals)
  };
}

// Helper: Get pair reserves (for DEX pricing)
export async function getPairReserves(
  pairAddress: string,
  chain: keyof typeof SKALE_CHAINS = 'EUROPA_HUB'
): Promise<{ reserve0: string; reserve1: string; token0: string; token1: string }> {
  const provider = createSkaleProvider(chain);
  const contract = new ethers.Contract(pairAddress, UNISWAP_V2_PAIR_ABI, provider);
  
  const [reserves, token0, token1] = await Promise.all([
    contract.getReserves(),
    contract.token0(),
    contract.token1()
  ]);
  
  return {
    reserve0: reserves[0].toString(),
    reserve1: reserves[1].toString(),
    token0,
    token1
  };
}

export default {
  SKALE_CHAINS,
  RUBY_CONTRACTS,
  CHIRPER_CONTRACTS,
  createSkaleProvider,
  getBlockNumber,
  getGasPrice,
  getBalance,
  callContract,
  getTokenInfo,
  getPairReserves
};
