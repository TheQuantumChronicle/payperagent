import { Router } from 'express';
import { getCharacters, getCharacterById, getEpisodes } from '../../services/rickAndMorty';
import { createX402Middleware } from '../../middleware/x402';
import { API_PRICING } from '../../config/pricing';

export const rickMortyRouter = Router();

let charactersMiddleware: any;
let characterMiddleware: any;
let episodesMiddleware: any;

(async () => {
  charactersMiddleware = await createX402Middleware({
    maxAmountRequired: API_PRICING.rickmorty_characters.amount,
    description: API_PRICING.rickmorty_characters.description,
  });
  
  characterMiddleware = await createX402Middleware({
    maxAmountRequired: API_PRICING.rickmorty_character.amount,
    description: API_PRICING.rickmorty_character.description,
  });
  
  episodesMiddleware = await createX402Middleware({
    maxAmountRequired: API_PRICING.rickmorty_episodes.amount,
    description: API_PRICING.rickmorty_episodes.description,
  });
})();

rickMortyRouter.get('/characters', async (req, res, next) => {
  try {
    if (!charactersMiddleware) {
      return res.status(503).json({
        success: false,
        error: 'Payment middleware initializing, please try again',
      });
    }

    return charactersMiddleware(req, res, async (err: any) => {
      if (err) return next(err);
      try {
        const page = parseInt(req.query.page as string) || 1;
        const result = await getCharacters(page);
        return res.json(result);
      } catch (error) {
        return next(error);
      }
    });
  } catch (error) {
    return next(error);
  }
});

rickMortyRouter.get('/character/:id', async (req, res, next) => {
  try {
    if (!characterMiddleware) {
      return res.status(503).json({
        success: false,
        error: 'Payment middleware initializing, please try again',
      });
    }

    return characterMiddleware(req, res, async (err: any) => {
      if (err) return next(err);
      try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
          return res.status(400).json({ success: false, error: 'Invalid character ID' });
        }
        const result = await getCharacterById(id);
        return res.json(result);
      } catch (error) {
        return next(error);
      }
    });
  } catch (error) {
    return next(error);
  }
});

rickMortyRouter.get('/episodes', async (req, res, next) => {
  try {
    if (!episodesMiddleware) {
      return res.status(503).json({
        success: false,
        error: 'Payment middleware initializing, please try again',
      });
    }

    return episodesMiddleware(req, res, async (err: any) => {
      if (err) return next(err);
      try {
        const page = parseInt(req.query.page as string) || 1;
        const result = await getEpisodes(page);
        return res.json(result);
      } catch (error) {
        return next(error);
      }
    });
  } catch (error) {
    return next(error);
  }
});
