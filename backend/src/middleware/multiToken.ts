import { Request, Response, NextFunction } from 'express';

export interface TokenConfig {
  symbol: string;
  address: string;
  decimals: number;
  network: string;
  conversionRate?: number; // Rate to USDC
}

export const SUPPORTED_TOKENS: Record<string, TokenConfig> = {
  USDC: {
    symbol: 'USDC',
    address: '0x...', // SKALE USDC address
    decimals: 6,
    network: 'skale-base-sepolia',
    conversionRate: 1.0
  },
  USDT: {
    symbol: 'USDT',
    address: '0x...', // SKALE USDT address
    decimals: 6,
    network: 'skale-base-sepolia',
    conversionRate: 1.0 // 1 USDT = 1 USDC
  },
  SKL: {
    symbol: 'SKL',
    address: '0x...', // SKALE native token
    decimals: 18,
    network: 'skale-base-sepolia',
    conversionRate: 0.05 // Example: 1 SKL = 0.05 USDC
  },
  WETH: {
    symbol: 'WETH',
    address: '0x...', // Wrapped ETH on SKALE
    decimals: 18,
    network: 'skale-base-sepolia',
    conversionRate: 3000 // Example: 1 WETH = 3000 USDC
  }
};

export function getTokenConfig(symbol: string): TokenConfig | null {
  return SUPPORTED_TOKENS[symbol.toUpperCase()] || null;
}

export function convertToUSDC(amount: number, fromToken: string): number {
  const token = getTokenConfig(fromToken);
  if (!token || !token.conversionRate) {
    throw new Error(`Unsupported token: ${fromToken}. Supported tokens: ${Object.keys(SUPPORTED_TOKENS).join(', ')}`);
  }
  if (amount <= 0) {
    throw new Error('Payment amount must be greater than 0');
  }
  return amount * token.conversionRate;
}

export function convertFromUSDC(usdcAmount: number, toToken: string): number {
  const token = getTokenConfig(toToken);
  if (!token || !token.conversionRate) {
    throw new Error(`Unsupported token: ${toToken}`);
  }
  return usdcAmount / token.conversionRate;
}

export function parseTokenHeader(req: Request): {
  token: string;
  amount: number;
} | null {
  const paymentToken = req.headers['x-payment-token'] as string;
  const paymentAmount = req.headers['x-payment-amount'] as string;

  if (!paymentToken || !paymentAmount) {
    return null;
  }

  const amount = parseFloat(paymentAmount);
  
  // Validate amount is a valid number
  if (isNaN(amount) || amount <= 0) {
    throw new Error('Invalid payment amount. Must be a positive number.');
  }

  return {
    token: paymentToken.toUpperCase(),
    amount
  };
}

export async function multiTokenMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tokenInfo = parseTokenHeader(req);
    
    if (!tokenInfo) {
      // No multi-token headers, proceed with default USDC
      return next();
    }

    const { token, amount } = tokenInfo;
    const tokenConfig = getTokenConfig(token);

    if (!tokenConfig) {
      res.status(400).json({
        success: false,
        error: `Unsupported payment token: ${token}`,
        supportedTokens: Object.keys(SUPPORTED_TOKENS),
        note: 'Use X-PAYMENT-TOKEN and X-PAYMENT-AMOUNT headers with supported tokens'
      });
      return;
    }

    // Convert to USDC for internal pricing
    const usdcEquivalent = convertToUSDC(amount, token);

    // Attach token info to request
    (req as any).paymentToken = {
      original: token,
      amount: amount,
      usdcEquivalent: usdcEquivalent,
      config: tokenConfig
    };

    next();
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message,
      supportedTokens: Object.keys(SUPPORTED_TOKENS)
    });
  }
}

export function getSupportedTokens(): TokenConfig[] {
  return Object.values(SUPPORTED_TOKENS);
}
