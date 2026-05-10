// We use built-in fetch for HTTP requests

/**
 * Fetch latitude and longitude for a given city name
 */
async function geocodeCity(city) {
  try {
    // Nominatim requires a User-Agent header
    const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`, {
      headers: {
        'User-Agent': 'Traveloop-Hackathon-App'
      }
    });
    
    const data = await response.json();
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
        display_name: data[0].display_name
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching geocoding data:', error);
    throw new Error('Failed to fetch location data');
  }
}

/**
 * Fetch exchange rate relative to a base currency, and optionally filter by target currency
 */
async function getExchangeRate(baseCurrency = 'INR', targetCurrency = null) {
  try {
    // Ensure uppercase
    baseCurrency = baseCurrency.toUpperCase();
    if (targetCurrency) targetCurrency = targetCurrency.toUpperCase();

    const response = await fetch(`https://open.er-api.com/v6/latest/${baseCurrency}`);
    const data = await response.json();
    
    if (data && data.result === 'success') {
      if (targetCurrency && data.rates[targetCurrency]) {
        return {
          base: baseCurrency,
          target: targetCurrency,
          rate: data.rates[targetCurrency]
        };
      }
      // If no target, or target not found, return all rates
      return {
        base: baseCurrency,
        rates: data.rates
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    throw new Error('Failed to fetch exchange rates');
  }
}

/**
 * Fetch weather for a given city
 */
async function getWeather(city) {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey || apiKey === 'your_openweather_api_key_here') {
    return { error: 'OpenWeather API Key not configured in .env' };
  }

  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`);
    const data = await response.json();
    if (data.cod === 200) {
      return {
        temperature: data.main.temp,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        humidity: data.main.humidity
      };
    }
    return { error: data.message };
  } catch (error) {
    console.error('Error fetching weather:', error);
    throw new Error('Failed to fetch weather data');
  }
}

/**
 * Fetch a beautiful photo of the city
 */
async function getCityPhoto(city) {
  const apiKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!apiKey || apiKey === 'your_unsplash_access_key_here') {
    return { error: 'Unsplash API Key not configured in .env' };
  }

  try {
    const response = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(city + ' landmark')}&per_page=1&orientation=landscape`, {
      headers: {
        'Authorization': `Client-ID ${apiKey}`
      }
    });
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      return {
        image_url: data.results[0].urls.regular,
        photographer: data.results[0].user.name,
        photographer_url: data.results[0].user.links.html
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching photo:', error);
    throw new Error('Failed to fetch city photo');
  }
}

module.exports = {
  geocodeCity,
  getExchangeRate,
  getWeather,
  getCityPhoto
};
