const dataService = require('../services/dataService');

exports.getGeocode = async (req, res) => {
  try {
    const { city } = req.query;
    if (!city) return res.status(400).json({ error: 'City parameter is required' });

    const data = await dataService.geocodeCity(city);
    if (!data) return res.status(404).json({ error: 'City not found' });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getExchangeRates = async (req, res) => {
  try {
    const { base, target } = req.query; // optional
    const data = await dataService.getExchangeRate(base || 'INR', target);
    if (!data) return res.status(500).json({ error: 'Failed to fetch exchange rates' });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getWeather = async (req, res) => {
  try {
    const { city } = req.query;
    if (!city) return res.status(400).json({ error: 'City parameter is required' });

    const data = await dataService.getWeather(city);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCityPhoto = async (req, res) => {
  try {
    const { city } = req.query;
    if (!city) return res.status(400).json({ error: 'City parameter is required' });

    const data = await dataService.getCityPhoto(city);
    if (!data) return res.status(404).json({ error: 'Photo not found for this city' });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
