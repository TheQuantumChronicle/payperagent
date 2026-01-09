import axios from 'axios';
import { circuitBreakers } from '../utils/circuitBreaker';

const ZIPCODE_API = 'http://api.zippopotam.us';

interface Place {
  'place name': string;
  longitude: string;
  state: string;
  'state abbreviation': string;
  latitude: string;
}

interface ZipCodeData {
  'post code': string;
  country: string;
  'country abbreviation': string;
  places: Place[];
}

export async function getZipCodeInfo(country: string, zipcode: string): Promise<{ success: boolean; data?: ZipCodeData; error?: string }> {
  try {
    const response = await circuitBreakers.zipcode.execute(() =>
      axios.get<ZipCodeData>(`${ZIPCODE_API}/${country}/${zipcode}`, {
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
      error: error.message || 'Failed to fetch zip code info',
    };
  }
}
