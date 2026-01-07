import axios from 'axios';
import { weatherCache } from './dbCache';
import { circuitBreakers } from '../utils/circuitBreaker';
import { ExternalAPIError, ValidationError } from '../utils/errors';

interface WeatherParams {
  city?: string;
  lat?: string;
  lon?: string;
}

export const getWeatherData = async (params: WeatherParams) => {
  // Check cache first
  const cacheKey = params.city || `${params.lat},${params.lon}`;
  const cached = weatherCache.get(cacheKey);
  if (cached) {
    console.log(`💾 Cache hit for weather: ${cacheKey}`);
    return cached;
  }
  
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    throw new ExternalAPIError('OpenWeather API key not configured', 'OpenWeather');
  }

  if (!params.city && (!params.lat || !params.lon)) {
    throw new ValidationError('Either city or (lat, lon) coordinates are required');
  }

  const baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
  let queryParams = `appid=${apiKey}&units=metric`;

  if (params.city) {
    queryParams += `&q=${encodeURIComponent(params.city)}`;
  } else if (params.lat && params.lon) {
    queryParams += `&lat=${params.lat}&lon=${params.lon}`;
  }

  const url = `${baseUrl}?${queryParams}`;

  try {
    const response = await circuitBreakers.openweather.execute(() =>
      axios.get(url, {
        timeout: 5000,
      })
    );

    if (!response.data || response.data.cod !== 200) {
      throw new Error(response.data?.message || 'Failed to fetch weather data');
    }

    const weatherData = {
      location: response.data.name,
      country: response.data.sys.country,
      temperature: response.data.main.temp,
      feels_like: response.data.main.feels_like,
      humidity: response.data.main.humidity,
      pressure: response.data.main.pressure,
      weather: response.data.weather[0].main,
      description: response.data.weather[0].description,
      wind_speed: response.data.wind.speed,
      clouds: response.data.clouds.all,
      coordinates: {
        lat: response.data.coord.lat,
        lon: response.data.coord.lon,
      },
    };
    
    weatherCache.set(cacheKey, weatherData);
    return weatherData;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new ExternalAPIError('Invalid OpenWeather API key', 'OpenWeather');
    }
    if (error.response?.status === 404) {
      throw new Error('Location not found');
    }
    throw new Error(error.message || 'Failed to fetch weather data');
  }
};
