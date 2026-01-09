import { Router } from 'express';
import { getAllCountries, getCountryByName, getCountryByCode } from '../../services/countries';
import { createX402Middleware } from '../../middleware/x402';
import { API_PRICING } from '../../config/pricing';

export const countriesRouter = Router();

let allMiddleware: any;
let nameMiddleware: any;
let codeMiddleware: any;

(async () => {
  allMiddleware = await createX402Middleware({
    maxAmountRequired: API_PRICING.countries_all.amount,
    description: API_PRICING.countries_all.description,
  });
  
  nameMiddleware = await createX402Middleware({
    maxAmountRequired: API_PRICING.countries_name.amount,
    description: API_PRICING.countries_name.description,
  });
  
  codeMiddleware = await createX402Middleware({
    maxAmountRequired: API_PRICING.countries_code.amount,
    description: API_PRICING.countries_code.description,
  });
})();

countriesRouter.get('/all', async (req, res, next) => {
  try {
    if (!allMiddleware) {
      return res.status(503).json({
        success: false,
        error: 'Payment middleware initializing, please try again',
      });
    }

    return allMiddleware(req, res, async (err: any) => {
      if (err) return next(err);
      try {
        const result = await getAllCountries();
        return res.json(result);
      } catch (error) {
        return next(error);
      }
    });
  } catch (error) {
    return next(error);
  }
});

countriesRouter.get('/name/:name', async (req, res, next) => {
  try {
    if (!nameMiddleware) {
      return res.status(503).json({
        success: false,
        error: 'Payment middleware initializing, please try again',
      });
    }

    return nameMiddleware(req, res, async (err: any) => {
      if (err) return next(err);
      try {
        const { name } = req.params;
        const result = await getCountryByName(name);
        return res.json(result);
      } catch (error) {
        return next(error);
      }
    });
  } catch (error) {
    return next(error);
  }
});

countriesRouter.get('/code/:code', async (req, res, next) => {
  try {
    if (!codeMiddleware) {
      return res.status(503).json({
        success: false,
        error: 'Payment middleware initializing, please try again',
      });
    }

    return codeMiddleware(req, res, async (err: any) => {
      if (err) return next(err);
      try {
        const { code } = req.params;
        const result = await getCountryByCode(code);
        return res.json(result);
      } catch (error) {
        return next(error);
      }
    });
  } catch (error) {
    return next(error);
  }
});
