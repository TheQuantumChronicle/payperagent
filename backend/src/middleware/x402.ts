import { skaleConfig } from '../config/skale';
import { Request, Response, NextFunction } from 'express';
import { ethers } from 'ethers';

export interface X402Options {
  maxAmountRequired: string;
  description: string;
  network?: string;
}

// Payment verification middleware
const createPaymentMiddleware = (options: X402Options) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const paymentHeader = req.headers['x-payment'] as string;
    
    if (!paymentHeader) {
      // Return 402 with payment requirements
      res.status(402).json({
        success: false,
        error: 'Payment Required',
        payment: {
          network: options.network || skaleConfig.network,
          chainId: skaleConfig.chainId,
          amount: options.maxAmountRequired,
          token: 'USDC',
          recipient: process.env.PAYMENT_RECIPIENT_ADDRESS || '0x742d35cc6634c0532925a3b844bc9e7595f0beb0',
          currency: 'USDC',
          description: options.description,
          facilitatorURL: skaleConfig.facilitatorUrl,
          instructions: 'Generate payment on SKALE Network and include proof in X-PAYMENT header',
        },
      });
      return;
    }
    
    // Verify payment
    try {
      const isValid = await verifyPayment(paymentHeader, options);
      
      if (isValid) {
        console.log(`✅ Payment verified for ${options.description}`);
        next();
      } else {
        res.status(402).json({
          success: false,
          error: 'Invalid payment proof',
          payment: {
            network: options.network || skaleConfig.network,
            chainId: skaleConfig.chainId,
            amount: options.maxAmountRequired,
            token: 'USDC',
            recipient: process.env.PAYMENT_RECIPIENT_ADDRESS || '0x742d35cc6634c0532925a3b844bc9e7595f0beb0',
            description: options.description,
          },
        });
      }
    } catch (error: any) {
      console.error('Payment verification error:', error.message);
      res.status(402).json({
        success: false,
        error: 'Payment verification failed',
        details: error.message,
      });
    }
  };
};

// Verify payment proof
async function verifyPayment(paymentProof: string, options: X402Options): Promise<boolean> {
  try {
    // Parse payment proof (format: signature:timestamp:amount)
    const parts = paymentProof.split(':');
    
    if (parts.length < 3) {
      // For development/testing, accept simple payment proofs
      if (process.env.NODE_ENV === 'development') {
        console.log('⚠️  Development mode: accepting test payment');
        return true;
      }
      return false;
    }
    
    const [signature, timestamp, amount] = parts;
    
    // Verify timestamp is recent (within 5 minutes)
    const now = Date.now();
    const paymentTime = parseInt(timestamp);
    if (now - paymentTime > 5 * 60 * 1000) {
      throw new Error('Payment proof expired');
    }
    
    // Verify amount matches requirement
    if (parseFloat(amount) < parseFloat(options.maxAmountRequired)) {
      throw new Error('Insufficient payment amount');
    }
    
    // Verify signature
    const message = `${timestamp}:${amount}:${options.description}`;
    const messageHash = ethers.hashMessage(message);
    const recoveredAddress = ethers.recoverAddress(messageHash, signature);
    
    // In production, verify the address has made the payment on-chain
    // For now, just verify the signature is valid
    if (recoveredAddress) {
      console.log(`Payment from: ${recoveredAddress}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Payment verification error:', error);
    return false;
  }
}

export const createX402Middleware = async (options: X402Options) => {
  console.log(`⚙️  Creating payment middleware for: ${options.description}`);
  console.log(`   Amount: ${options.maxAmountRequired} USDC`);
  console.log(`   Network: ${options.network || skaleConfig.network}`);
  return createPaymentMiddleware(options);
};
