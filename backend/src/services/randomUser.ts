import axios from 'axios';
import { circuitBreakers } from '../utils/circuitBreaker';

const RANDOM_USER_API = 'https://randomuser.me/api';

interface RandomUser {
  gender: string;
  name: {
    title: string;
    first: string;
    last: string;
  };
  location: {
    street: { number: number; name: string };
    city: string;
    state: string;
    country: string;
    postcode: string | number;
  };
  email: string;
  phone: string;
  picture: {
    large: string;
    medium: string;
    thumbnail: string;
  };
  nat: string;
}

export async function getRandomUsers(count: number = 1, nationality?: string): Promise<{ success: boolean; data?: RandomUser[]; error?: string }> {
  try {
    const params: any = { results: count };
    if (nationality) params.nat = nationality;

    const response = await circuitBreakers.randomuser.execute(() =>
      axios.get<{ results: RandomUser[] }>(RANDOM_USER_API, {
        params,
        timeout: 10000,
      })
    );

    return {
      success: true,
      data: response.data.results,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to fetch random users',
    };
  }
}
