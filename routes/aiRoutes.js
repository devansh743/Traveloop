const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// Feature 1: AI Itinerary Generator
router.post('/generate-itinerary', aiController.generateItinerary);

// Feature 2: Smart Packing List AI
router.post('/generate-packing-list', aiController.generatePackingList);

// Feature 3: Budget Analysis AI
router.post('/analyze-budget', aiController.analyzeBudget);

// Feature 4: Activity Recommendation Engine
router.post('/recommend-activities', aiController.recommendActivities);

// Feature 5: Public Itinerary Enhancement
router.post('/enhance-itinerary', aiController.enhanceItinerary);

module.exports = router;
