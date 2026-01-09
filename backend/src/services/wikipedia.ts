import axios from 'axios';
import { weatherCache } from './dbCache';

const WIKIPEDIA_API_URL = 'https://en.wikipedia.org/w/api.php';

interface WikipediaSearchParams {
  query: string;
  limit?: number;
}

interface WikipediaPageParams {
  title: string;
}

export async function searchWikipedia(params: WikipediaSearchParams): Promise<any> {
  const { query, limit = 5 } = params;

  const cacheKey = `wiki:search:${query}:${limit}`;
  const cached = await weatherCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const response = await axios.get(`${WIKIPEDIA_API_URL}/w/api.php`, {
      params: {
        action: 'opensearch',
        search: query,
        limit,
        namespace: 0,
        format: 'json',
      },
      headers: {
        'User-Agent': 'PayPerAgent/1.0 (https://github.com/TheQuantumChronicle/payperagent) Node.js/Axios'
      },
      timeout: 10000,
    });

    const [searchQuery, titles, descriptions, urls] = response.data;

    const results = titles.map((title: string, index: number) => ({
      title,
      description: descriptions[index],
      url: urls[index],
    }));

    const result = {
      query: searchQuery,
      results,
      count: results.length,
      metadata: {
        limit,
        namespace: 0,
        hasResults: results.length > 0,
      },
      timestamp: new Date().toISOString(),
    };

    // Cache for 1 hour
    await weatherCache.set(cacheKey, result, 3600000);

    return result;
  } catch (error: any) {
    throw new Error(`Wikipedia search failed: ${error.message}`);
  }
}

export async function getWikipediaPage(params: WikipediaPageParams): Promise<any> {
  const { title } = params;

  const cacheKey = `wiki:page:${title}`;
  const cached = await weatherCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    // Get page extract
    const response = await axios.get(WIKIPEDIA_API_URL, {
      params: {
        action: 'query',
        format: 'json',
        titles: title,
        prop: 'extracts|info|pageimages',
        exintro: true,
        explaintext: true,
        inprop: 'url',
        pithumbsize: 500,
      },
      timeout: 10000,
    });

    const pages = response.data.query.pages;
    const pageId = Object.keys(pages)[0];
    const page = pages[pageId];

    if (pageId === '-1') {
      throw new Error('Page not found');
    }

    const result = {
      pageId: page.pageid,
      title: page.title,
      extract: page.extract,
      url: page.fullurl,
      canonicalurl: page.canonicalurl,
      thumbnail: page.thumbnail ? {
        source: page.thumbnail.source,
        width: page.thumbnail.width,
        height: page.thumbnail.height,
      } : null,
      pageimage: page.pageimage || null,
      metadata: {
        length: page.length,
        touched: page.touched,
        lastrevid: page.lastrevid,
        extractLength: page.extract?.length || 0,
        hasImage: !!page.thumbnail,
      },
      timestamp: new Date().toISOString(),
    };

    // Cache for 1 day
    await weatherCache.set(cacheKey, result, 86400000);

    return result;
  } catch (error: any) {
    throw new Error(`Wikipedia page fetch failed: ${error.message}`);
  }
}
