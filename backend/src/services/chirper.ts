import axios from 'axios';
import { cryptoCache } from './dbCache';

const CHIRPER_API_URL = 'https://api.chirper.ai/v1';

interface TrendingParams {
  limit?: number;
  timeframe?: '1h' | '24h' | '7d';
}

interface SentimentParams {
  topic: string;
  timeframe?: '1h' | '24h' | '7d';
}

interface AgentStatsParams {
  agentId?: string;
}

export async function getTrendingTopics(params: TrendingParams = {}): Promise<any> {
  const { limit = 10, timeframe = '24h' } = params;
  
  const cacheKey = `chirper:trending:${limit}:${timeframe}`;
  const cached = await cryptoCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const response = await axios.get(`${CHIRPER_API_URL}/trending`, {
      params: { limit, timeframe },
      timeout: 5000
    });

    const result = {
      topics: response.data.topics || [],
      timeframe,
      totalAgents: response.data.totalAgents || 0,
      totalChirps: response.data.totalChirps || 0,
      lastUpdated: new Date().toISOString(),
      source: 'Chirper.ai'
    };

    await cryptoCache.set(cacheKey, result, 300);
    return result;
  } catch (error: any) {
    console.error('Chirper.ai API error:', error.message);
    throw new Error(`Failed to fetch trending topics from Chirper.ai: ${error.message}`);
  }
}

export async function getSentimentAnalysis(params: SentimentParams): Promise<any> {
  const { topic, timeframe = '24h' } = params;
  
  const cacheKey = `chirper:sentiment:${topic}:${timeframe}`;
  const cached = await cryptoCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const response = await axios.get(`${CHIRPER_API_URL}/sentiment`, {
      params: { topic, timeframe },
      timeout: 5000
    });

    const result = {
      topic,
      timeframe,
      sentiment: response.data.sentiment || 0,
      sentimentLabel: response.data.sentimentLabel || 'neutral',
      positiveCount: response.data.positiveCount || 0,
      negativeCount: response.data.negativeCount || 0,
      neutralCount: response.data.neutralCount || 0,
      totalMentions: response.data.totalMentions || 0,
      topAgents: response.data.topAgents || [],
      lastUpdated: new Date().toISOString(),
      source: 'Chirper.ai'
    };

    await cryptoCache.set(cacheKey, result, 300);
    return result;
  } catch (error: any) {
    console.error('Chirper.ai sentiment API error:', error.message);
    throw new Error(`Failed to fetch sentiment analysis from Chirper.ai: ${error.message}`);
  }
}

export async function getAgentStats(params: AgentStatsParams = {}): Promise<any> {
  const { agentId } = params;
  
  const cacheKey = agentId ? `chirper:agent:${agentId}` : 'chirper:network-stats';
  const cached = await cryptoCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const endpoint = agentId ? `/agent/${agentId}` : '/stats';
    const response = await axios.get(`${CHIRPER_API_URL}${endpoint}`, {
      timeout: 5000
    });

    const result = {
      ...response.data,
      lastUpdated: new Date().toISOString(),
      source: 'Chirper.ai'
    };

    await cryptoCache.set(cacheKey, result, 600);
    return result;
  } catch (error: any) {
    console.error('Chirper.ai stats API error:', error.message);
    throw new Error(`Failed to fetch agent stats from Chirper.ai: ${error.message}`);
  }
}

export async function getAIConversations(topic: string, limit: number = 5): Promise<any> {
  const cacheKey = `chirper:conversations:${topic}:${limit}`;
  const cached = await cryptoCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const response = await axios.get(`${CHIRPER_API_URL}/conversations`, {
      params: { topic, limit },
      timeout: 5000
    });

    const result = {
      topic,
      conversations: response.data.conversations || [],
      lastUpdated: new Date().toISOString(),
      source: 'Chirper.ai'
    };

    await cryptoCache.set(cacheKey, result, 300);
    return result;
  } catch (error: any) {
    console.error('Chirper.ai conversations API error:', error.message);
    throw new Error(`Failed to fetch AI conversations from Chirper.ai: ${error.message}`);
  }
}
