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
      timezone: response.data.timezone,
      coordinates: {
        lat: response.data.coord.lat,
        lon: response.data.coord.lon,
      },
      current: {
        temperature: response.data.main.temp,
        feels_like: response.data.main.feels_like,
        temp_min: response.data.main.temp_min,
        temp_max: response.data.main.temp_max,
        pressure: response.data.main.pressure,
        humidity: response.data.main.humidity,
        sea_level: response.data.main.sea_level,
        ground_level: response.data.main.grnd_level,
      },
      weather: {
        main: response.data.weather[0].main,
        description: response.data.weather[0].description,
        icon: response.data.weather[0].icon,
        id: response.data.weather[0].id,
      },
      wind: {
        speed: response.data.wind.speed,
        deg: response.data.wind.deg,
        gust: response.data.wind.gust,
      },
      clouds: {
        all: response.data.clouds.all,
      },
      visibility: response.data.visibility,
      rain: response.data.rain,
      snow: response.data.snow,
      sun: {
        sunrise: new Date(response.data.sys.sunrise * 1000).toISOString(),
        sunset: new Date(response.data.sys.sunset * 1000).toISOString(),
      },
      dt: new Date(response.data.dt * 1000).toISOString(),
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
