import { Router } from 'express';
import { getIPInfo, generateQRCode, getPublicHolidays, getHackerNewsTop, getRandomDog, getRandomCat } from '../../services/utilities';
import { createX402Middleware } from '../../middleware/x402';
import { API_PRICING } from '../../config/pricing';

export const utilitiesRouter = Router();

let ipMiddleware: any;
let qrMiddleware: any;
let holidaysMiddleware: any;
let hackernewsMiddleware: any;
let randomdogMiddleware: any;
let randomcatMiddleware: any;

(async () => {
  ipMiddleware = await createX402Middleware({
    maxAmountRequired: API_PRICING.ip.amount,
    description: API_PRICING.ip.description,
  });

  qrMiddleware = await createX402Middleware({
    maxAmountRequired: API_PRICING.qr.amount,
    description: API_PRICING.qr.description,
  });

  holidaysMiddleware = await createX402Middleware({
    maxAmountRequired: API_PRICING.holidays.amount,
    description: API_PRICING.holidays.description,
  });

  hackernewsMiddleware = await createX402Middleware({
    maxAmountRequired: API_PRICING.hackernews.amount,
    description: API_PRICING.hackernews.description,
  });

  randomdogMiddleware = await createX402Middleware({
    maxAmountRequired: API_PRICING.randomdog.amount,
    description: API_PRICING.randomdog.description,
  });

  randomcatMiddleware = await createX402Middleware({
    maxAmountRequired: API_PRICING.randomcat.amount,
    description: API_PRICING.randomcat.description,
  });
})();

utilitiesRouter.get('/ip', async (req, res, next) => {
  if (!ipMiddleware) {
    return res.status(503).json({ success: false, error: 'Payment middleware initializing' });
  }
  return ipMiddleware(req, res, async (err: any) => {
    if (err) return next(err);
    try {
      const { ip } = req.query;
      const data = await getIPInfo(ip as string);
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
});

utilitiesRouter.get('/qr', async (req, res, next) => {
  if (!qrMiddleware) {
    return res.status(503).json({ success: false, error: 'Payment middleware initializing' });
  }
  return qrMiddleware(req, res, async (err: any) => {
    if (err) return next(err);
    try {
      const { text, size } = req.query;
      if (!text) {
        return res.status(400).json({ success: false, error: 'Text parameter required' });
      }
      const url = generateQRCode(text as string, size ? parseInt(size as string) : undefined);
      res.json({ qr_code_url: url, text, timestamp: new Date().toISOString() });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
});

utilitiesRouter.get('/holidays', async (req, res, next) => {
  if (!holidaysMiddleware) {
    return res.status(503).json({ success: false, error: 'Payment middleware initializing' });
  }
  return holidaysMiddleware(req, res, async (err: any) => {
    if (err) return next(err);
    try {
      const { year, country } = req.query;
      if (!year || !country) {
        return res.status(400).json({
          success: false,
          error: 'Parameters required: year, country',
          example: '/api/utilities/holidays?year=2024&country=US',
        });
      }
      const data = await getPublicHolidays(parseInt(year as string), country as string);
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
});

utilitiesRouter.get('/hackernews', async (req, res, next) => {
  if (!hackernewsMiddleware) {
    return res.status(503).json({ success: false, error: 'Payment middleware initializing' });
  }
  return hackernewsMiddleware(req, res, async (err: any) => {
    if (err) return next(err);
    try {
      const { limit } = req.query;
      const data = await getHackerNewsTop(limit ? parseInt(limit as string) : undefined);
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
});

utilitiesRouter.get('/random/dog', async (req, res, next) => {
  if (!randomdogMiddleware) {
    return res.status(503).json({ success: false, error: 'Payment middleware initializing' });
  }
  return randomdogMiddleware(req, res, async (err: any) => {
    if (err) return next(err);
    try {
      const data = await getRandomDog();
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
});

utilitiesRouter.get('/random/cat', async (req, res, next) => {
  if (!randomcatMiddleware) {
    return res.status(503).json({ success: false, error: 'Payment middleware initializing' });
  }
  return randomcatMiddleware(req, res, async (err: any) => {
    if (err) return next(err);
    try {
      const data = await getRandomCat();
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
});
