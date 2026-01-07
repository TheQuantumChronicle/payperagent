import { Router } from 'express';
import { cryptoCache, weatherCache, newsCache } from '../services/dbCache';

export const cacheRouter = Router();

cacheRouter.get('/stats', async (_req, res) => {
  try {
    const [cryptoStats, weatherStats, newsStats] = await Promise.all([
      cryptoCache.getStats(),
      weatherCache.getStats(),
      newsCache.getStats(),
    ]);
    
    res.json({
      crypto: cryptoStats,
      weather: weatherStats,
      news: newsStats,
    });
  } catch (error) {
    console.error('Cache stats error:', error);
    res.status(500).json({ error: 'Failed to fetch cache stats' });
  }
});

cacheRouter.post('/clear', async (_req, res) => {
  try {
    await Promise.all([
      cryptoCache.clear(),
      weatherCache.clear(),
      newsCache.clear(),
    ]);
    
    res.json({
      success: true,
      message: 'All caches cleared',
    });
  } catch (error) {
    console.error('Cache clear error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to clear caches' 
    });
  }
});

cacheRouter.post('/clear/:type', async (req, res): Promise<void> => {
  const { type } = req.params;
  
  try {
    switch (type) {
      case 'crypto':
        await cryptoCache.clear();
        break;
      case 'weather':
        await weatherCache.clear();
        break;
      case 'news':
        await newsCache.clear();
        break;
      default:
        res.status(400).json({
          success: false,
          error: 'Invalid cache type. Use: crypto, weather, or news',
        });
        return;
    }
    
    res.json({
      success: true,
      message: `${type} cache cleared`,
    });
  } catch (error) {
    console.error(`Cache clear error (${type}):`, error);
    res.status(500).json({
      success: false,
      error: `Failed to clear ${type} cache`,
    });
  }
});
