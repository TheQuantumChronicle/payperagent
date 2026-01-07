import axios from 'axios';
import { newsCache } from './dbCache';
import { circuitBreakers } from '../utils/circuitBreaker';
import { ExternalAPIError, ValidationError, RateLimitError } from '../utils/errors';

interface NewsParams {
  query?: string;
  category?: string;
  country?: string;
  pageSize?: number;
}

export const getNewsData = async (params: NewsParams) => {
  // Check cache first
  const cacheKey = JSON.stringify(params);
  const cached = newsCache.get(cacheKey);
  if (cached) {
    console.log(`💾 Cache hit for news: ${cacheKey.substring(0, 50)}...`);
    return cached;
  }
  
  const apiKey = process.env.NEWS_API_KEY;

  if (!apiKey) {
    throw new ExternalAPIError('News API key not configured. Please add NEWS_API_KEY to your .env file', 'NewsAPI');
  }

  const validCategories = ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology'];
  if (params.category && !validCategories.includes(params.category)) {
    throw new ValidationError(`Invalid category. Must be one of: ${validCategories.join(', ')}`);
  }

  const baseUrl = 'https://newsapi.org/v2/top-headlines';
  const queryParams = new URLSearchParams({
    apiKey,
    pageSize: (params.pageSize || 10).toString(),
  });

  if (params.query) {
    queryParams.append('q', params.query);
  }
  if (params.category) {
    queryParams.append('category', params.category);
  }
  if (params.country) {
    queryParams.append('country', params.country);
  } else {
    queryParams.append('country', 'us');
  }

  try {
    const response = await circuitBreakers.newsapi.execute(() =>
      axios.get(`${baseUrl}?${queryParams.toString()}`, {
        timeout: 5000,
      })
    );

    if (response.data.status !== 'ok') {
      throw new Error(response.data.message || 'Failed to fetch news data');
    }

    const newsData = {
      totalResults: response.data.totalResults,
      articles: response.data.articles.map((article: any) => ({
        title: article.title,
        description: article.description,
        url: article.url,
        source: article.source.name,
        publishedAt: article.publishedAt,
        author: article.author,
        imageUrl: article.urlToImage,
      })),
    };
    
    newsCache.set(cacheKey, newsData);
    return newsData;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new ExternalAPIError('Invalid News API key', 'NewsAPI');
    }
    if (error.response?.status === 429) {
      throw new RateLimitError('News API rate limit exceeded. Please upgrade your plan', 3600, 'NEWSAPI_RATE_LIMIT');
    }
    throw new ExternalAPIError(error.message || 'Failed to fetch news data', 'NewsAPI');
  }
};
