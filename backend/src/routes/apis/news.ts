import { Router } from 'express';
import { getNewsData } from '../../services/news';
import { createX402Middleware } from '../../middleware/x402';
import { API_PRICING } from '../../config/pricing';
import { validateNewsParams } from '../../middleware/validation';

export const newsRouter = Router();

let paywallMiddleware: any;

(async () => {
  const middleware = await createX402Middleware({
    maxAmountRequired: API_PRICING.news.amount,
    description: API_PRICING.news.description,
  });
  paywallMiddleware = middleware;
})();

newsRouter.get('/', validateNewsParams, async (req, res, next) => {
  try {
    if (!paywallMiddleware) {
      return res.status(503).json({
        success: false,
        error: 'Payment middleware initializing, please try again in a moment',
      });
    }

    return paywallMiddleware(req, res, async (err: any) => {
      if (err) return next(err);

      try {
        const { query, category, country, pageSize } = req.query;

        const newsData = await getNewsData({
          query: query as string,
          category: category as string,
          country: country as string,
          pageSize: pageSize ? parseInt(pageSize as string) : undefined,
        });

        return res.json({
          success: true,
          data: newsData,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        return next(error);
      }
    });
  } catch (error) {
    return next(error);
  }
});
