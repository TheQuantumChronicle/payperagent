/**
 * Jokes API Service
 * Free API - No authentication required
 * https://github.com/15Dkatz/official_joke_api
 */

import axios from 'axios';
import { circuitBreakers } from '../utils/circuitBreaker';

const JOKES_API_URL = 'https://official-joke-api.appspot.com';

export async function getRandomJoke() {
  return circuitBreakers.jokes.execute(async () => {
    const response = await axios.get(`${JOKES_API_URL}/random_joke`, {
      timeout: 5000,
    });

    return {
      success: true,
      data: {
        id: response.data.id,
        type: response.data.type,
        setup: response.data.setup,
        punchline: response.data.punchline,
      },
      timestamp: new Date().toISOString(),
    };
  });
}

export async function getJokesByType(type: string) {
  return circuitBreakers.jokes.execute(async () => {
    const response = await axios.get(`${JOKES_API_URL}/jokes/${type}/ten`, {
      timeout: 5000,
    });

    const jokes = response.data.map((joke: any) => ({
      id: joke.id,
      type: joke.type,
      setup: joke.setup,
      punchline: joke.punchline,
    }));

    return {
      success: true,
      data: jokes,
      count: jokes.length,
      type,
      timestamp: new Date().toISOString(),
    };
  });
}

export async function searchJokes(query: string) {
  return circuitBreakers.jokes.execute(async () => {
    const response = await axios.get(`${JOKES_API_URL}/jokes/search`, {
      params: { term: query },
      timeout: 5000,
    });

    const jokes = response.data.map((joke: any) => ({
      id: joke.id,
      type: joke.type,
      setup: joke.setup,
      punchline: joke.punchline,
    }));

    return {
      success: true,
      data: jokes,
      count: jokes.length,
      query,
      timestamp: new Date().toISOString(),
    };
  });
}
