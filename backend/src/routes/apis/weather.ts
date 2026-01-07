import { Router } from 'express';
import { getWeatherData } from '../../services/weather';
import { createX402Middleware } from '../../middleware/x402';
import { API_PRICING } from '../../config/pricing';
import { validateWeatherParams } from '../../middleware/validation';

export const weatherRouter = Router();

let paywallMiddleware: any;

(async () => {
  const middleware = await createX402Middleware({
    maxAmountRequired: API_PRICING.weather.amount,
    description: API_PRICING.weather.description,
  });
  paywallMiddleware = middleware;
})();

weatherRouter.get('/', validateWeatherParams, async (req, res, next) => {
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
        const { city, lat, lon } = req.query;

        if (!city && (!lat || !lon)) {
          return res.status(400).json({
            success: false,
            error: 'Please provide either city name or coordinates (lat, lon)',
          });
        }

        const weatherData = await getWeatherData({
          city: city as string,
          lat: lat as string,
          lon: lon as string,
        });

        return res.json({
          success: true,
          data: weatherData,
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
