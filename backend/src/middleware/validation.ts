import { Request, Response, NextFunction } from 'express';

/**
 * Validation middleware for API requests
 */

export const validateWeatherParams = (req: Request, res: Response, next: NextFunction): void => {
  const { city, lat, lon } = req.query;

  // Must have either city OR both lat and lon
  if (!city && (!lat || !lon)) {
    res.status(400).json({
      success: false,
      error: {
        message: 'Missing required parameters',
        details: 'Please provide either "city" OR both "lat" and "lon"',
        examples: [
          '/api/weather?city=London',
          '/api/weather?lat=40.7128&lon=-74.0060',
        ],
      },
    });
    return;
  }

  // Validate lat/lon if provided
  if (lat || lon) {
    const latitude = parseFloat(lat as string);
    const longitude = parseFloat(lon as string);

    if (isNaN(latitude) || isNaN(longitude)) {
      res.status(400).json({
        success: false,
        error: {
          message: 'Invalid coordinates',
          details: 'Latitude and longitude must be valid numbers',
          provided: { lat, lon },
        },
      });
      return;
    }

    if (latitude < -90 || latitude > 90) {
      res.status(400).json({
        success: false,
        error: {
          message: 'Invalid latitude',
          details: 'Latitude must be between -90 and 90',
          provided: latitude,
        },
      });
      return;
    }

    if (longitude < -180 || longitude > 180) {
      res.status(400).json({
        success: false,
        error: {
          message: 'Invalid longitude',
          details: 'Longitude must be between -180 and 180',
          provided: longitude,
        },
      });
      return;
    }
  }

  next();
};

export const validateCryptoParams = (req: Request, res: Response, next: NextFunction): void => {
  const { symbol, symbols } = req.query;

  if (!symbol && !symbols) {
    res.status(400).json({
      success: false,
      error: {
        message: 'Missing required parameters',
        details: 'Please provide either "symbol" or "symbols"',
        examples: [
          '/api/crypto?symbol=BTCUSDT',
          '/api/crypto?symbols=BTCUSDT,ETHUSDT,BNBUSDT',
        ],
        supportedSymbols: [
          'BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'ADAUSDT',
          'DOGEUSDT', 'XRPUSDT', 'MATICUSDT', 'DOTUSDT', 'AVAXUSDT',
        ],
      },
    });
    return;
  }

  // Validate symbol format (must end with USDT)
  const symbolsToCheck = symbols ? (symbols as string).split(',') : [symbol as string];
  const invalidSymbols = symbolsToCheck.filter(s => !s.toUpperCase().endsWith('USDT'));

  if (invalidSymbols.length > 0) {
    res.status(400).json({
      success: false,
      error: {
        message: 'Invalid symbol format',
        details: 'All symbols must be trading pairs with USDT (e.g., BTCUSDT)',
        invalidSymbols,
        hint: 'Symbols should end with "USDT"',
      },
    });
    return;
  }

  next();
};

export const validateNewsParams = (req: Request, res: Response, next: NextFunction): void => {
  const { category, pageSize } = req.query;

  const validCategories = ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology'];

  if (category && !validCategories.includes(category as string)) {
    res.status(400).json({
      success: false,
      error: {
        message: 'Invalid category',
        details: `Category must be one of: ${validCategories.join(', ')}`,
        provided: category,
        validCategories,
      },
    });
    return;
  }

  if (pageSize) {
    const size = parseInt(pageSize as string);
    if (isNaN(size) || size < 1 || size > 100) {
      res.status(400).json({
        success: false,
        error: {
          message: 'Invalid page size',
          details: 'Page size must be a number between 1 and 100',
          provided: pageSize,
        },
      });
      return;
    }
  }

  next();
};
