/**
 * Bored API Service
 * Free API - No authentication required
 * https://www.boredapi.com/
 */

import axios from 'axios';
import { circuitBreakers } from '../utils/circuitBreaker';

const BORED_API_URL = 'https://www.boredapi.com/api';

export async function getRandomActivity() {
  return circuitBreakers.bored.execute(async () => {
    const response = await axios.get(`${BORED_API_URL}/activity`, {
      timeout: 5000,
    });

    return {
      success: true,
      data: {
        activity: response.data.activity,
        type: response.data.type,
        participants: response.data.participants,
        price: response.data.price,
        link: response.data.link || null,
        key: response.data.key,
        accessibility: response.data.accessibility,
      },
      timestamp: new Date().toISOString(),
    };
  });
}

export async function getActivityByType(type: string) {
  return circuitBreakers.bored.execute(async () => {
    const response = await axios.get(`${BORED_API_URL}/activity`, {
      params: { type },
      timeout: 5000,
    });

    return {
      success: true,
      data: {
        activity: response.data.activity,
        type: response.data.type,
        participants: response.data.participants,
        price: response.data.price,
        link: response.data.link || null,
        key: response.data.key,
        accessibility: response.data.accessibility,
      },
      filter: { type },
      timestamp: new Date().toISOString(),
    };
  });
}

export async function getActivityByParticipants(participants: number) {
  return circuitBreakers.bored.execute(async () => {
    const response = await axios.get(`${BORED_API_URL}/activity`, {
      params: { participants },
      timeout: 5000,
    });

    return {
      success: true,
      data: {
        activity: response.data.activity,
        type: response.data.type,
        participants: response.data.participants,
        price: response.data.price,
        link: response.data.link || null,
        key: response.data.key,
        accessibility: response.data.accessibility,
      },
      filter: { participants },
      timestamp: new Date().toISOString(),
    };
  });
}
