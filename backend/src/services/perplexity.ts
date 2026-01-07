import axios from 'axios';
import { cryptoCache } from './dbCache';

const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';

interface PerplexityRequest {
  query: string;
  model?: string;
  max_tokens?: number;
}

interface PerplexityResponse {
  id: string;
  model: string;
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export async function searchPerplexity(params: PerplexityRequest): Promise<any> {
  const { query, model = 'sonar-pro', max_tokens = 1000 } = params;

  const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY?.trim();
  
  if (!PERPLEXITY_API_KEY) {
    console.error('Perplexity API key check:', {
      exists: !!process.env.PERPLEXITY_API_KEY,
      length: process.env.PERPLEXITY_API_KEY?.length,
      trimmed: PERPLEXITY_API_KEY?.length
    });
    throw new Error('Perplexity API key not configured');
  }

  // Check cache first
  const cacheKey = `perplexity:${model}:${query}`;
  const cached = await cryptoCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const response = await axios.post<PerplexityResponse>(
      PERPLEXITY_API_URL,
      {
        model,
        messages: [
          {
            role: 'system',
            content: 'You are a helpful AI assistant that provides accurate, concise answers based on current web information.',
          },
          {
            role: 'user',
            content: query,
          },
        ],
        max_tokens,
        temperature: 0.2,
        top_p: 0.9,
        return_citations: true,
        search_domain_filter: [],
        return_images: false,
        return_related_questions: true,
        search_recency_filter: 'month',
        top_k: 0,
        stream: false,
        presence_penalty: 0,
        frequency_penalty: 1,
      },
      {
        headers: {
          'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    const result = {
      answer: response.data.choices[0].message.content,
      model: response.data.model,
      usage: response.data.usage,
      timestamp: new Date().toISOString(),
    };

    // Cache for 5 minutes
    await cryptoCache.set(cacheKey, result, 300000);

    return result;
  } catch (error: any) {
    if (error.response) {
      throw new Error(`Perplexity API error: ${error.response.data.error?.message || error.response.statusText}`);
    }
    throw new Error(`Perplexity API request failed: ${error.message}`);
  }
}
