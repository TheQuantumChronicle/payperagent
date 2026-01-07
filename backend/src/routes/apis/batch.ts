import { Router } from 'express';
import { processBatchCalls, calculateBatchPrice } from '../../services/batch';
import { createX402Middleware } from '../../middleware/x402';
import { API_PRICING } from '../../config/pricing';

export const batchRouter = Router();

let batchMiddleware: any;

(async () => {
  // Batch calls have dynamic pricing based on number of calls
  // We'll use a base price and calculate actual price in the route
  batchMiddleware = await createX402Middleware({
    maxAmountRequired: '0.100', // Max for batch (up to 100 calls)
    description: 'Batch API calls with volume discounts',
  });
})();

// Batch API endpoint
batchRouter.post('/', async (req, res, next) => {
  if (!batchMiddleware) {
    return res.status(503).json({ success: false, error: 'Payment middleware initializing' });
  }
  
  return batchMiddleware(req, res, async (err: any) => {
    if (err) return next(err);
    
    try {
      const { calls } = req.body;
      
      if (!calls || !Array.isArray(calls) || calls.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Calls array required',
          example: {
            calls: [
              { endpoint: '/api/crypto', params: { symbol: 'BTCUSDT' } },
              { endpoint: '/api/weather', params: { city: 'London' } },
              { endpoint: '/api/news', params: { category: 'tech' } }
            ]
          }
        });
      }

      if (calls.length > 100) {
        return res.status(400).json({
          success: false,
          error: 'Maximum 100 calls per batch request'
        });
      }

      // Calculate pricing
      const pricing = calculateBatchPrice(calls, API_PRICING);
      
      // Get base URL from request
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      
      // Get payment header to pass to individual calls
      const paymentHeader = req.headers['x-payment'] as string || 'test';
      
      // Process all calls
      const results = await processBatchCalls(calls, baseUrl, paymentHeader);
      
      res.json({
        success: true,
        batch: {
          ...results,
          pricing: {
            ...pricing,
            currency: 'USDC',
            note: `${pricing.discountPercentage * 100}% discount applied for ${calls.length} calls`
          }
        },
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
});

// Get batch pricing info (no payment required)
batchRouter.get('/pricing', async (req, res) => {
  try {
    const { calls } = req.query;
    const callCount = calls ? parseInt(calls as string) : 5;
    
    // Mock calls for pricing calculation
    const mockCalls = Array.from({ length: callCount }, () => ({
      endpoint: '/api/crypto',
      params: { symbol: 'BTCUSDT' }
    }));
    
    const pricing = calculateBatchPrice(mockCalls, API_PRICING);
    
    res.json({
      callCount,
      pricing: {
        ...pricing,
        currency: 'USDC'
      },
      discountTiers: [
        { calls: '1-4', discount: '0%' },
        { calls: '5-9', discount: '10%' },
        { calls: '10-19', discount: '20%' },
        { calls: '20+', discount: '30%' }
      ],
      maxCallsPerBatch: 100,
      example: {
        calls: [
          { endpoint: '/api/crypto', params: { symbol: 'BTCUSDT' } },
          { endpoint: '/api/weather', params: { city: 'London' } },
          { endpoint: '/api/news', params: { category: 'tech' } },
          { endpoint: '/api/coingecko', params: { per_page: 5 } },
          { endpoint: '/api/github/search', params: { query: 'skale' } }
        ]
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});
