const geminiService = require('../services/geminiService');

// Feature 1: AI Itinerary Generator
exports.generateItinerary = async (req, res) => {
  try {
    const {
      destination,
      trip_duration_days,
      budget,
      traveler_type,
      interests,
      trip_start_date,
      transportation_preference,
      preferred_pace,
      hotel_location
    } = req.body;

    const prompt = `
    You are an expert AI travel planner for Traveloop.
    Generate a complete multi-day itinerary for the following details:
    Destination: ${destination}
    Duration: ${trip_duration_days} days
    Budget: ${budget}
    Traveler Type: ${traveler_type}
    Interests: ${interests ? interests.join(', ') : 'General'}
    Start Date: ${trip_start_date}
    Transportation: ${transportation_preference}
    Pace: ${preferred_pace}
    Hotel Location: ${hotel_location}

    Provide the output matching this exact JSON structure:
    {
      "trip_summary": {
        "destination": "",
        "duration": "",
        "estimated_total_cost": "",
        "travel_style": ""
      },
      "days": [
        {
          "day": 1,
          "theme": "",
          "estimated_cost": "",
          "activities": [
            {
              "time": "Morning",
              "title": "",
              "description": "",
              "location": "",
              "estimated_cost": "",
              "duration": "",
              "transportation": ""
            }
          ],
          "food_recommendations": [],
          "budget_tip": ""
        }
      ]
    }
    
    Rules:
    - Include morning, afternoon, and evening activities.
    - Optimize by geography.
    - Prevent unrealistic over-scheduling.
    - Return ONLY valid JSON.
    `;

    const result = await geminiService.generateJsonFromGemini(prompt);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to generate itinerary' });
  }
};

// Feature 2: Smart Packing List AI
exports.generatePackingList = async (req, res) => {
  try {
    const {
      destination,
      weather,
      trip_duration,
      traveler_type,
      planned_activities
    } = req.body;

    const prompt = `
    You are an expert travel planner for Traveloop.
    Generate a categorized packing list for:
    Destination: ${destination}
    Weather: ${weather}
    Duration: ${trip_duration}
    Traveler Type: ${traveler_type}
    Activities: ${planned_activities ? planned_activities.join(', ') : 'None specified'}

    Provide the output matching this exact JSON structure:
    {
      "packing_list": {
        "clothing": [],
        "electronics": [],
        "toiletries": [],
        "documents": [],
        "accessories": [],
        "emergency_items": []
      },
      "travel_tips": []
    }
    `;

    const result = await geminiService.generateJsonFromGemini(prompt);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to generate packing list' });
  }
};

// Feature 3: Budget Analysis AI
exports.analyzeBudget = async (req, res) => {
  try {
    const {
      destination,
      total_budget,
      planned_expenses,
      daily_average_spending
    } = req.body;

    const prompt = `
    You are a budget analysis expert for Traveloop.
    Analyze trip affordability and detect overspending for:
    Destination: ${destination}
    Total Budget: ${total_budget}
    Planned Expenses: ${JSON.stringify(planned_expenses)}
    Daily Spending: ${daily_average_spending}

    Provide the output matching this exact JSON structure:
    {
      "budget_status": "",
      "estimated_remaining_budget": "",
      "warnings": [],
      "recommendations": [],
      "cheaper_alternatives": []
    }
    `;

    const result = await geminiService.generateJsonFromGemini(prompt);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to analyze budget' });
  }
};

// Feature 4: Activity Recommendation Engine
exports.recommendActivities = async (req, res) => {
  try {
    const {
      destination,
      interests,
      budget,
      travel_style
    } = req.body;

    const prompt = `
    You are an activity recommendation engine for Traveloop.
    Recommend activities for:
    Destination: ${destination}
    Interests: ${interests ? interests.join(', ') : 'General'}
    Budget: ${budget}
    Travel Style: ${travel_style}

    Provide the output matching this exact JSON structure:
    {
      "recommended_activities": [
        {
          "title": "",
          "type": "",
          "description": "",
          "estimated_cost": "",
          "duration": "",
          "best_time_to_visit": "",
          "location": ""
        }
      ]
    }
    `;

    const result = await geminiService.generateJsonFromGemini(prompt);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to recommend activities' });
  }
};

// Feature 5: Public Itinerary Enhancement
exports.enhanceItinerary = async (req, res) => {
  try {
    const {
      destination,
      duration,
      activities
    } = req.body;

    const prompt = `
    You are a social media and travel expert for Traveloop.
    Create an engaging, social-media ready summary for a trip:
    Destination: ${destination}
    Duration: ${duration}
    Activities: ${JSON.stringify(activities)}

    Provide the output matching this exact JSON structure:
    {
      "public_title": "",
      "short_description": "",
      "highlights": []
    }
    `;

    const result = await geminiService.generateJsonFromGemini(prompt);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to enhance itinerary' });
  }
};
