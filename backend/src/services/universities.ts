import axios from 'axios';
import { circuitBreakers } from '../utils/circuitBreaker';

const UNIVERSITIES_API = 'http://universities.hipolabs.com';

interface University {
  name: string;
  country: string;
  alpha_two_code: string;
  'state-province': string | null;
  domains: string[];
  web_pages: string[];
}

export async function searchUniversities(country?: string, name?: string): Promise<{ success: boolean; data?: University[]; error?: string }> {
  try {
    const params: any = {};
    if (country) params.country = country;
    if (name) params.name = name;

    const response = await circuitBreakers.universities.execute(() =>
      axios.get<University[]>(`${UNIVERSITIES_API}/search`, {
        params,
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
      error: error.message || 'Failed to search universities',
    };
  }
}
