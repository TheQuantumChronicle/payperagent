export const validateCity = (city: string): boolean => {
  if (!city || typeof city !== 'string') return false;
  return city.trim().length > 0 && city.trim().length < 100;
};

export const validateCoordinates = (lat: string, lon: string): boolean => {
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lon);
  
  if (isNaN(latitude) || isNaN(longitude)) return false;
  
  return latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180;
};

export const validateCryptoSymbol = (symbol: string): boolean => {
  if (!symbol || typeof symbol !== 'string') return false;
  const cleaned = symbol.trim().toLowerCase();
  return /^[a-z0-9-,]+$/.test(cleaned);
};

export const validateNewsCategory = (category: string): boolean => {
  const validCategories = ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology'];
  return validCategories.includes(category.toLowerCase());
};

export const validateCountryCode = (code: string): boolean => {
  if (!code || typeof code !== 'string') return false;
  return /^[a-z]{2}$/i.test(code);
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};
