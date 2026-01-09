import axios from 'axios';
import { circuitBreakers } from '../utils/circuitBreaker';

const CAT_FACTS_API = 'https://catfact.ninja';

interface CatFactResponse {
  fact: string;
  length: number;
}

export async function getRandomCatFact(): Promise<{ success: boolean; data?: CatFactResponse; error?: string }> {
  try {
    const response = await circuitBreakers.catfacts.execute(() =>
      axios.get<CatFactResponse>(`${CAT_FACTS_API}/fact`, {
        timeout: 10000,
      })
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to fetch cat fact',
    };
  }
}

export async function getMultipleCatFacts(limit: number = 5): Promise<{ success: boolean; data?: CatFactResponse[]; error?: string }> {
  try {
    const response = await circuitBreakers.catfacts.execute(() =>
      axios.get<{ data: CatFactResponse[] }>(`${CAT_FACTS_API}/facts?limit=${limit}`, {
        timeout: 10000,
      })
    );

    return {
      success: true,
      data: response.data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to fetch cat facts',
    };
  }
}
