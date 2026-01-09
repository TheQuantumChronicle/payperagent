import axios from 'axios';
import { circuitBreakers } from '../utils/circuitBreaker';

const ADVICE_API = 'https://api.adviceslip.com';

interface AdviceSlip {
  id: number;
  advice: string;
}

export async function getRandomAdvice(): Promise<{ success: boolean; data?: AdviceSlip; error?: string }> {
  try {
    const response = await circuitBreakers.advice.execute(() =>
      axios.get<{ slip: AdviceSlip }>(`${ADVICE_API}/advice`, {
        timeout: 10000,
      })
    );

    return {
      success: true,
      data: response.data.slip,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to fetch advice',
    };
  }
}

export async function searchAdvice(query: string): Promise<{ success: boolean; data?: AdviceSlip[]; error?: string }> {
  try {
    const response = await circuitBreakers.advice.execute(() =>
      axios.get<{ slips: AdviceSlip[] }>(`${ADVICE_API}/advice/search/${encodeURIComponent(query)}`, {
        timeout: 10000,
      })
    );

    return {
      success: true,
      data: response.data.slips,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to search advice',
    };
  }
}
