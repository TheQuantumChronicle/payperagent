import { Router } from 'express';
import { predictAge, predictGender, predictNationality, predictAll } from '../../services/namePredictor';
import { createX402Middleware } from '../../middleware/x402';
import { API_PRICING } from '../../config/pricing';

export const namePredictorRouter = Router();

let ageMiddleware: any;
let genderMiddleware: any;
let nationalityMiddleware: any;
let allMiddleware: any;

(async () => {
  ageMiddleware = await createX402Middleware({
    maxAmountRequired: API_PRICING.name_age.amount,
    description: API_PRICING.name_age.description,
  });
  
  genderMiddleware = await createX402Middleware({
    maxAmountRequired: API_PRICING.name_gender.amount,
    description: API_PRICING.name_gender.description,
  });
  
  nationalityMiddleware = await createX402Middleware({
    maxAmountRequired: API_PRICING.name_nationality.amount,
    description: API_PRICING.name_nationality.description,
  });
  
  allMiddleware = await createX402Middleware({
    maxAmountRequired: API_PRICING.name_all.amount,
    description: API_PRICING.name_all.description,
  });
})();

// Predict age from name
namePredictorRouter.get('/age', async (req, res, next) => {
  try {
    if (!ageMiddleware) {
      return res.status(503).json({
        success: false,
        error: 'Payment middleware initializing, please try again',
      });
    }

    return ageMiddleware(req, res, async (err: any) => {
      if (err) return next(err);
      try {
        const { name } = req.query;
        if (!name || typeof name !== 'string') {
          return res.status(400).json({ success: false, error: 'Query parameter "name" is required' });
        }
        const result = await predictAge(name);
        return res.json(result);
      } catch (error) {
        return next(error);
      }
    });
  } catch (error) {
    return next(error);
  }
});

// Predict gender from name
namePredictorRouter.get('/gender', async (req, res, next) => {
  try {
    if (!genderMiddleware) {
      return res.status(503).json({
        success: false,
        error: 'Payment middleware initializing, please try again',
      });
    }

    return genderMiddleware(req, res, async (err: any) => {
      if (err) return next(err);
      try {
        const { name } = req.query;
        if (!name || typeof name !== 'string') {
          return res.status(400).json({ success: false, error: 'Query parameter "name" is required' });
        }
        const result = await predictGender(name);
        return res.json(result);
      } catch (error) {
        return next(error);
      }
    });
  } catch (error) {
    return next(error);
  }
});

// Predict nationality from name
namePredictorRouter.get('/nationality', async (req, res, next) => {
  try {
    if (!nationalityMiddleware) {
      return res.status(503).json({
        success: false,
        error: 'Payment middleware initializing, please try again',
      });
    }

    return nationalityMiddleware(req, res, async (err: any) => {
      if (err) return next(err);
      try {
        const { name } = req.query;
        if (!name || typeof name !== 'string') {
          return res.status(400).json({ success: false, error: 'Query parameter "name" is required' });
        }
        const result = await predictNationality(name);
        return res.json(result);
      } catch (error) {
        return next(error);
      }
    });
  } catch (error) {
    return next(error);
  }
});

// Predict all (age, gender, nationality)
namePredictorRouter.get('/all', async (req, res, next) => {
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
        const { name } = req.query;
        if (!name || typeof name !== 'string') {
          return res.status(400).json({ success: false, error: 'Query parameter "name" is required' });
        }
        const result = await predictAll(name);
        return res.json(result);
      } catch (error) {
        return next(error);
      }
    });
  } catch (error) {
    return next(error);
  }
});
