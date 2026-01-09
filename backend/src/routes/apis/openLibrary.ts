import { Router } from 'express';
import { searchBooks, getBookByISBN } from '../../services/openLibrary';
import { createX402Middleware } from '../../middleware/x402';
import { API_PRICING } from '../../config/pricing';

export const openLibraryRouter = Router();

let searchMiddleware: any;
let isbnMiddleware: any;

(async () => {
  searchMiddleware = await createX402Middleware({
    maxAmountRequired: API_PRICING.openlibrary_search.amount,
    description: API_PRICING.openlibrary_search.description,
  });
  
  isbnMiddleware = await createX402Middleware({
    maxAmountRequired: API_PRICING.openlibrary_isbn.amount,
    description: API_PRICING.openlibrary_isbn.description,
  });
})();

openLibraryRouter.get('/search', async (req, res, next) => {
  try {
    if (!searchMiddleware) {
      return res.status(503).json({
        success: false,
        error: 'Payment middleware initializing, please try again',
      });
    }

    return searchMiddleware(req, res, async (err: any) => {
      if (err) return next(err);
      try {
        const { q, limit } = req.query;
        if (!q || typeof q !== 'string') {
          return res.status(400).json({ success: false, error: 'Query parameter "q" is required' });
        }
        const limitNum = limit ? parseInt(limit as string) : 10;
        const result = await searchBooks(q, limitNum);
        return res.json(result);
      } catch (error) {
        return next(error);
      }
    });
  } catch (error) {
    return next(error);
  }
});

openLibraryRouter.get('/isbn/:isbn', async (req, res, next) => {
  try {
    if (!isbnMiddleware) {
      return res.status(503).json({
        success: false,
        error: 'Payment middleware initializing, please try again',
      });
    }

    return isbnMiddleware(req, res, async (err: any) => {
      if (err) return next(err);
      try {
        const { isbn } = req.params;
        const result = await getBookByISBN(isbn);
        return res.json(result);
      } catch (error) {
        return next(error);
      }
    });
  } catch (error) {
    return next(error);
  }
});
