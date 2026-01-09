import axios from 'axios';
import { circuitBreakers } from '../utils/circuitBreaker';

const OPEN_LIBRARY_API = 'https://openlibrary.org';

interface Book {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  isbn?: string[];
  cover_i?: number;
  publisher?: string[];
}

export async function searchBooks(query: string, limit: number = 10): Promise<{ success: boolean; data?: Book[]; error?: string }> {
  try {
    const response = await circuitBreakers.openlibrary.execute(() =>
      axios.get<{ docs: Book[] }>(`${OPEN_LIBRARY_API}/search.json`, {
        params: { q: query, limit },
        timeout: 10000,
      })
    );

    return {
      success: true,
      data: response.data.docs,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to search books',
    };
  }
}

export async function getBookByISBN(isbn: string): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const response = await circuitBreakers.openlibrary.execute(() =>
      axios.get(`${OPEN_LIBRARY_API}/isbn/${isbn}.json`, {
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
      error: error.message || 'Failed to fetch book',
    };
  }
}
