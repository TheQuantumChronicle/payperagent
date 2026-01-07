import axios from 'axios';
import { weatherCache } from './dbCache';

// IP Geolocation
export async function getIPInfo(ip?: string): Promise<any> {
  const targetIP = ip || 'check';
  const cacheKey = `ip:${targetIP}`;
  const cached = await weatherCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const response = await axios.get(`https://ipapi.co/${targetIP}/json/`, {
      timeout: 10000,
    });

    const result = {
      ip: response.data.ip,
      city: response.data.city,
      region: response.data.region,
      country: response.data.country_name,
      country_code: response.data.country_code,
      latitude: response.data.latitude,
      longitude: response.data.longitude,
      timezone: response.data.timezone,
      currency: response.data.currency,
      org: response.data.org,
      timestamp: new Date().toISOString(),
    };

    // Cache for 1 day
    await weatherCache.set(cacheKey, result, 86400000);

    return result;
  } catch (error: any) {
    throw new Error(`IP lookup failed: ${error.message}`);
  }
}

// QR Code Generator
export function generateQRCode(text: string, size: number = 200): string {
  // Returns URL to QR code image
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}`;
}

// Public Holidays
export async function getPublicHolidays(year: number, countryCode: string): Promise<any> {
  const cacheKey = `holidays:${year}:${countryCode}`;
  const cached = await weatherCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const response = await axios.get(`https://date.nager.at/api/v2/publicholidays/${year}/${countryCode}`, {
      timeout: 10000,
    });

    const result = {
      year,
      country: countryCode,
      holidays: response.data.map((holiday: any) => ({
        date: holiday.date,
        name: holiday.localName,
        name_en: holiday.name,
        fixed: holiday.fixed,
        global: holiday.global,
        counties: holiday.counties,
        types: holiday.types,
      })),
      count: response.data.length,
      timestamp: new Date().toISOString(),
    };

    // Cache for 1 month
    await weatherCache.set(cacheKey, result, 2592000000);

    return result;
  } catch (error: any) {
    throw new Error(`Holidays API error: ${error.message}`);
  }
}

// HackerNews
export async function getHackerNewsTop(limit: number = 10): Promise<any> {
  const cacheKey = `hackernews:top:${limit}`;
  const cached = await weatherCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    // Get top story IDs
    const topStoriesResponse = await axios.get('https://hacker-news.firebaseio.com/v0/topstories.json', {
      timeout: 10000,
    });

    const storyIds = topStoriesResponse.data.slice(0, limit);

    // Fetch each story
    const stories = await Promise.all(
      storyIds.map(async (id: number) => {
        const storyResponse = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
        return {
          id: storyResponse.data.id,
          title: storyResponse.data.title,
          url: storyResponse.data.url,
          score: storyResponse.data.score,
          by: storyResponse.data.by,
          time: new Date(storyResponse.data.time * 1000).toISOString(),
          descendants: storyResponse.data.descendants,
        };
      })
    );

    const result = {
      stories,
      count: stories.length,
      timestamp: new Date().toISOString(),
    };

    // Cache for 5 minutes
    await weatherCache.set(cacheKey, result, 300000);

    return result;
  } catch (error: any) {
    throw new Error(`HackerNews API error: ${error.message}`);
  }
}

// Random Dog Image
export async function getRandomDog(): Promise<any> {
  try {
    const response = await axios.get('https://random.dog/woof.json', {
      timeout: 10000,
    });

    return {
      url: response.data.url,
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    throw new Error(`Random dog API error: ${error.message}`);
  }
}

// Random Cat Image
export async function getRandomCat(): Promise<any> {
  try {
    const response = await axios.get('https://api.thecatapi.com/v1/images/search', {
      timeout: 10000,
    });

    return {
      url: response.data[0].url,
      width: response.data[0].width,
      height: response.data[0].height,
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    throw new Error(`Random cat API error: ${error.message}`);
  }
}
