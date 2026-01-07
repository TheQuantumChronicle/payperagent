import axios from 'axios';
import { weatherCache } from './dbCache';

const GITHUB_API_URL = 'https://api.github.com';

interface GitHubSearchParams {
  query: string;
  sort?: 'stars' | 'forks' | 'updated';
  order?: 'desc' | 'asc';
  per_page?: number;
}

interface GitHubUserParams {
  username: string;
}

export async function searchGitHubRepos(params: GitHubSearchParams): Promise<any> {
  const { query, sort = 'stars', order = 'desc', per_page = 10 } = params;

  const cacheKey = `github:search:${query}:${sort}:${per_page}`;
  const cached = await weatherCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const response = await axios.get(`${GITHUB_API_URL}/search/repositories`, {
      params: {
        q: query,
        sort,
        order,
        per_page,
      },
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'PayPerAgent/1.0',
      },
      timeout: 10000,
    });

    const repos = response.data.items.map((repo: any) => ({
      name: repo.name,
      full_name: repo.full_name,
      description: repo.description,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language,
      url: repo.html_url,
      created_at: repo.created_at,
      updated_at: repo.updated_at,
      owner: {
        login: repo.owner.login,
        avatar: repo.owner.avatar_url,
      },
    }));

    const result = {
      query,
      total_count: response.data.total_count,
      repos,
      count: repos.length,
      timestamp: new Date().toISOString(),
    };

    // Cache for 10 minutes
    await weatherCache.set(cacheKey, result, 600000);

    return result;
  } catch (error: any) {
    throw new Error(`GitHub API error: ${error.message}`);
  }
}

export async function getGitHubUser(params: GitHubUserParams): Promise<any> {
  const { username } = params;

  const cacheKey = `github:user:${username}`;
  const cached = await weatherCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const response = await axios.get(`${GITHUB_API_URL}/users/${username}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'PayPerAgent/1.0',
      },
      timeout: 10000,
    });

    const result = {
      login: response.data.login,
      name: response.data.name,
      bio: response.data.bio,
      avatar: response.data.avatar_url,
      public_repos: response.data.public_repos,
      followers: response.data.followers,
      following: response.data.following,
      created_at: response.data.created_at,
      url: response.data.html_url,
      timestamp: new Date().toISOString(),
    };

    // Cache for 1 hour
    await weatherCache.set(cacheKey, result, 3600000);

    return result;
  } catch (error: any) {
    throw new Error(`GitHub user fetch failed: ${error.message}`);
  }
}
