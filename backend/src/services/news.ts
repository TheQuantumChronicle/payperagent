import axios from 'axios';
import { newsCache } from './dbCache';
import { circuitBreakers } from '../utils/circuitBreaker';
import { ExternalAPIError, ValidationError, RateLimitError } from '../utils/errors';

const getTimeAgo = (dateString: string): string => {
  const now = new Date();
  const published = new Date(dateString);
  const diffMs = now.getTime() - published.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 60) return `${diffMins} minutes ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  return `${diffDays} days ago`;
};

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
      query: params.query || null,
      category: params.category || 'general',
      country: params.country || 'us',
      articles: response.data.articles.map((article: any) => ({
        title: article.title,
        description: article.description,
        content: article.content,
        url: article.url,
        urlToImage: article.urlToImage,
        source: {
          id: article.source.id,
          name: article.source.name,
        },
        author: article.author,
        publishedAt: article.publishedAt,
        metadata: {
          hasImage: !!article.urlToImage,
          hasContent: !!article.content,
          wordCount: article.description ? article.description.split(' ').length : 0,
          publishedDate: new Date(article.publishedAt).toLocaleDateString(),
          publishedTime: new Date(article.publishedAt).toLocaleTimeString(),
          timeAgo: getTimeAgo(article.publishedAt),
        },
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
