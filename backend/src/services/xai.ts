import axios from 'axios';
import { cryptoCache } from './dbCache';

const XAI_API_URL = 'https://api.x.ai/v1/chat/completions';

interface XAIRequest {
  prompt: string;
  model?: string;
  max_tokens?: number;
  temperature?: number;
}

export async function queryXAI(params: XAIRequest): Promise<any> {
  const { prompt, model = 'grok-beta', max_tokens = 1000, temperature = 0.7 } = params;

  const XAI_API_KEY = process.env.XAI_API_KEY?.trim();
  
  if (!XAI_API_KEY) {
    console.error('XAI API key check:', {
      exists: !!process.env.XAI_API_KEY,
      length: process.env.XAI_API_KEY?.length,
      trimmed: XAI_API_KEY?.length
    });
    throw new Error('XAI API key not configured');
  }

  const cacheKey = `xai:${model}:${prompt.substring(0, 50)}`;
  const cached = await cryptoCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const response = await axios.post(
      XAI_API_URL,
      {
        model,
        messages: [
          {
            role: 'system',
            content: 'You are Grok, a helpful AI assistant created by xAI.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens,
        temperature,
        stream: false,
      },
      {
        headers: {
          'Authorization': `Bearer ${XAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    const result = {
      response: response.data.choices[0].message.content,
      model: response.data.model,
      usage: response.data.usage,
      timestamp: new Date().toISOString(),
    };

    // Cache for 5 minutes
    await cryptoCache.set(cacheKey, result, 300000);

    return result;
  } catch (error: any) {
    if (error.response) {
      throw new Error(`XAI API error: ${error.response.data.error?.message || error.response.statusText}`);
    }
    throw new Error(`XAI API request failed: ${error.message}`);
  }
}
