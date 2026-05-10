const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController');

// 1. Geocoding Endpoint (for Leaflet Maps)
router.get('/geocode', dataController.getGeocode);

// 2. Exchange Rate Endpoint
router.get('/exchange-rate', dataController.getExchangeRates);

// 3. Weather Endpoint
router.get('/weather', dataController.getWeather);

// 4. City Photos Endpoint
router.get('/photos', dataController.getCityPhoto);

module.exports = router;
