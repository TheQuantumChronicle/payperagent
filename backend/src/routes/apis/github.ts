import { Router } from 'express';
import { searchGitHubRepos, getGitHubUser } from '../../services/github';
import { createX402Middleware } from '../../middleware/x402';
import { API_PRICING } from '../../config/pricing';

export const githubRouter = Router();

let paywallMiddleware: any;

(async () => {
  const middleware = await createX402Middleware({
    maxAmountRequired: API_PRICING.github.amount,
    description: API_PRICING.github.description,
  });
  paywallMiddleware = middleware;
})();

githubRouter.get('/search', async (req, res, next) => {
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
        const { query, sort, order, per_page } = req.query;

        if (!query) {
          return res.status(400).json({
            success: false,
            error: 'Query parameter is required',
            example: '/api/github/search?query=react&sort=stars',
          });
        }

        const data = await searchGitHubRepos({
          query: query as string,
          sort: sort as any,
          order: order as any,
          per_page: per_page ? parseInt(per_page as string) : undefined,
        });

        res.setHeader('x-cache-hit', 'true');
        res.json(data);
      } catch (error: any) {
        res.status(500).json({
          success: false,
          error: error.message,
        });
      }
    });
  } catch (error) {
    next(error);
  }
});

githubRouter.get('/user/:username', async (req, res, next) => {
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
        const { username } = req.params;

        const data = await getGitHubUser({ username });

        res.setHeader('x-cache-hit', 'true');
        res.json(data);
      } catch (error: any) {
        res.status(500).json({
          success: false,
          error: error.message,
        });
      }
    });
  } catch (error) {
    next(error);
  }
});
