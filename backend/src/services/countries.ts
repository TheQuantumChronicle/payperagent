import axios from 'axios';
import { circuitBreakers } from '../utils/circuitBreaker';

const COUNTRIES_API = 'https://restcountries.com/v3.1';

interface Country {
  name: {
    common: string;
    official: string;
  };
  capital?: string[];
  region: string;
  subregion?: string;
  population: number;
  flags: {
    png: string;
    svg: string;
  };
  currencies?: Record<string, { name: string; symbol: string }>;
  languages?: Record<string, string>;
}

export async function getAllCountries(): Promise<{ success: boolean; data?: Country[]; error?: string }> {
  try {
    const response = await circuitBreakers.countries.execute(() =>
      axios.get<Country[]>(`${COUNTRIES_API}/all`, {
        timeout: 15000,
      })
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to fetch countries',
    };
  }
}

export async function getCountryByName(name: string): Promise<{ success: boolean; data?: Country[]; error?: string }> {
  try {
    const response = await circuitBreakers.countries.execute(() =>
      axios.get<Country[]>(`${COUNTRIES_API}/name/${encodeURIComponent(name)}`, {
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
      error: error.message || 'Failed to fetch country',
    };
  }
}

export async function getCountryByCode(code: string): Promise<{ success: boolean; data?: Country[]; error?: string }> {
  try {
    const response = await circuitBreakers.countries.execute(() =>
      axios.get<Country[]>(`${COUNTRIES_API}/alpha/${code}`, {
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
      error: error.message || 'Failed to fetch country',
    };
  }
}
