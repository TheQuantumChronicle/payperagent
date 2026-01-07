import axios from 'axios';
import { newsCache } from './dbCache';

const REDDIT_API_URL = 'https://www.reddit.com';

interface RedditParams {
  subreddit: string;
  sort?: 'hot' | 'new' | 'top' | 'rising';
  time?: 'hour' | 'day' | 'week' | 'month' | 'year' | 'all';
  limit?: number;
}

export async function getRedditPosts(params: RedditParams): Promise<any> {
  const { subreddit, sort = 'hot', time = 'day', limit = 10 } = params;

  const cacheKey = `reddit:${subreddit}:${sort}:${time}:${limit}`;
  const cached = await newsCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const url = `${REDDIT_API_URL}/r/${subreddit}/${sort}.json`;
    const response = await axios.get(url, {
      params: {
        limit,
        t: time,
      },
      headers: {
        'User-Agent': 'PayPerAgent/1.0',
      },
      timeout: 10000,
    });

    const posts = response.data.data.children.map((child: any) => ({
      title: child.data.title,
      author: child.data.author,
      score: child.data.score,
      num_comments: child.data.num_comments,
      created: new Date(child.data.created_utc * 1000).toISOString(),
      url: `https://reddit.com${child.data.permalink}`,
      selftext: child.data.selftext,
      thumbnail: child.data.thumbnail !== 'self' ? child.data.thumbnail : null,
      subreddit: child.data.subreddit,
    }));

    const result = {
      subreddit,
      sort,
      time,
      posts,
      count: posts.length,
      timestamp: new Date().toISOString(),
    };

    // Cache for 5 minutes
    await newsCache.set(cacheKey, result, 300000);

    return result;
  } catch (error: any) {
    throw new Error(`Reddit API error: ${error.message}`);
  }
}
