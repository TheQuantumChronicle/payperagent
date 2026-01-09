import axios from 'axios';
import { circuitBreakers } from '../utils/circuitBreaker';

const RICK_MORTY_API = 'https://rickandmortyapi.com/api';

interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: { name: string; url: string };
  location: { name: string; url: string };
  image: string;
  episode: string[];
}

interface Episode {
  id: number;
  name: string;
  air_date: string;
  episode: string;
  characters: string[];
}

export async function getCharacters(page: number = 1): Promise<{ success: boolean; data?: Character[]; error?: string }> {
  try {
    const response = await circuitBreakers.rickmorty.execute(() =>
      axios.get<{ results: Character[] }>(`${RICK_MORTY_API}/character`, {
        params: { page },
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
      error: error.message || 'Failed to fetch characters',
    };
  }
}

export async function getCharacterById(id: number): Promise<{ success: boolean; data?: Character; error?: string }> {
  try {
    const response = await circuitBreakers.rickmorty.execute(() =>
      axios.get<Character>(`${RICK_MORTY_API}/character/${id}`, {
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
      error: error.message || 'Failed to fetch character',
    };
  }
}

export async function getEpisodes(page: number = 1): Promise<{ success: boolean; data?: Episode[]; error?: string }> {
  try {
    const response = await circuitBreakers.rickmorty.execute(() =>
      axios.get<{ results: Episode[] }>(`${RICK_MORTY_API}/episode`, {
        params: { page },
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
      error: error.message || 'Failed to fetch episodes',
    };
  }
}
