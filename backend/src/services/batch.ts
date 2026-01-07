import axios from 'axios';

interface BatchCall {
  endpoint: string;
  method?: 'GET' | 'POST';
  params?: Record<string, any>;
  body?: Record<string, any>;
}

interface BatchResult {
  endpoint: string;
  success: boolean;
  data?: any;
  error?: string;
  responseTime: number;
}

export async function processBatchCalls(
  calls: BatchCall[],
  baseUrl: string,
  paymentHeader: string
): Promise<{
  results: BatchResult[];
  totalCalls: number;
  successfulCalls: number;
  failedCalls: number;
  totalTime: number;
  averageTime: number;
}> {
  const startTime = Date.now();
  const results: BatchResult[] = [];

  // Process all calls in parallel
  const promises = calls.map(async (call) => {
    const callStartTime = Date.now();
    
    try {
      const url = `${baseUrl}${call.endpoint}`;
      const config: any = {
        method: call.method || 'GET',
        url,
        headers: {
          'X-PAYMENT': paymentHeader,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      };

      if (call.params) {
        config.params = call.params;
      }

      if (call.body && call.method === 'POST') {
        config.data = call.body;
      }

      const response = await axios(config);
      const responseTime = Date.now() - callStartTime;

      return {
        endpoint: call.endpoint,
        success: true,
        data: response.data,
        responseTime
      };
    } catch (error: any) {
      const responseTime = Date.now() - callStartTime;
      
      return {
        endpoint: call.endpoint,
        success: false,
        error: error.response?.data?.error || error.message,
        responseTime
      };
    }
  });

  const batchResults = await Promise.all(promises);
  results.push(...batchResults);

  const totalTime = Date.now() - startTime;
  const successfulCalls = results.filter(r => r.success).length;
  const failedCalls = results.filter(r => !r.success).length;
  const averageTime = results.reduce((sum, r) => sum + r.responseTime, 0) / results.length;

  return {
    results,
    totalCalls: calls.length,
    successfulCalls,
    failedCalls,
    totalTime,
    averageTime: Math.round(averageTime)
  };
}

export function calculateBatchDiscount(callCount: number): number {
  // Discount tiers for batch calls
  if (callCount >= 20) return 0.30; // 30% off for 20+ calls
  if (callCount >= 10) return 0.20; // 20% off for 10-19 calls
  if (callCount >= 5) return 0.10;  // 10% off for 5-9 calls
  return 0; // No discount for < 5 calls
}

export function calculateBatchPrice(calls: BatchCall[], pricing: Record<string, any>): {
  individualTotal: number;
  discountPercentage: number;
  discountAmount: number;
  finalPrice: number;
  savings: number;
} {
  // Calculate individual prices
  let individualTotal = 0;
  
  for (const call of calls) {
    // Extract pricing key from endpoint
    const endpointKey = call.endpoint.split('/').filter(Boolean).join('_');
    const price = pricing[endpointKey]?.amount || 0.001; // Default 0.001 USDC
    individualTotal += parseFloat(price);
  }

  const discountPercentage = calculateBatchDiscount(calls.length);
  const discountAmount = individualTotal * discountPercentage;
  const finalPrice = individualTotal - discountAmount;
  const savings = discountAmount;

  return {
    individualTotal: parseFloat(individualTotal.toFixed(6)),
    discountPercentage,
    discountAmount: parseFloat(discountAmount.toFixed(6)),
    finalPrice: parseFloat(finalPrice.toFixed(6)),
    savings: parseFloat(savings.toFixed(6))
  };
}
