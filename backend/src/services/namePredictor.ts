/**
 * Name Predictor APIs Service
 * Free APIs - No authentication required
 * - Agify.io: Predict age from name
 * - Genderize.io: Predict gender from name
 * - Nationalize.io: Predict nationality from name
 */

import axios from 'axios';
import { circuitBreakers } from '../utils/circuitBreaker';

export async function predictAge(name: string) {
  return circuitBreakers.agify.execute(async () => {
    const response = await axios.get('https://api.agify.io', {
      params: { name },
      timeout: 5000,
    });

    const data = {
      name: response.data.name,
      age: response.data.age,
      count: response.data.count,
    };

    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  });
}

export async function predictGender(name: string) {
  return circuitBreakers.genderize.execute(async () => {
    const response = await axios.get('https://api.genderize.io', {
      params: { name },
      timeout: 5000,
    });

    const data = {
      name: response.data.name,
      gender: response.data.gender,
      probability: response.data.probability,
      count: response.data.count,
    };

    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  });
}

export async function predictNationality(name: string) {
  return circuitBreakers.nationalize.execute(async () => {
    const response = await axios.get('https://api.nationalize.io', {
      params: { name },
      timeout: 5000,
    });

    const data = {
      name: response.data.name,
      country: response.data.country,
      count: response.data.count,
    };

    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  });
}

export async function predictAll(name: string) {
  const [age, gender, nationality] = await Promise.all([
    predictAge(name),
    predictGender(name),
    predictNationality(name),
  ]);

  return {
    success: true,
    data: {
      name,
      age: age.data,
      gender: gender.data,
      nationality: nationality.data,
    },
    timestamp: new Date().toISOString(),
  };
}
