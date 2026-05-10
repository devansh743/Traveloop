const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
};

const makeRequest = (path, body) => {
  return new Promise((resolve, reject) => {
    const req = http.request({ ...options, path, method: 'POST' }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data);
        }
      });
    });

    req.on('error', reject);
    req.write(JSON.stringify(body));
    req.end();
  });
};

async function runTests() {
  console.log("Starting tests...\n");

  console.log("=== Testing 1: Generate Itinerary ===");
  const it = await makeRequest('/api/ai/generate-itinerary', {
    destination: "Paris",
    trip_duration_days: 2,
    budget: "$1500",
    traveler_type: "Couple",
    interests: ["Art", "Food"],
    trip_start_date: "2024-10-15",
    transportation_preference: "Public Transit",
    preferred_pace: "Relaxed",
    hotel_location: "Le Marais"
  });
  console.log(JSON.stringify(it, null, 2));

  console.log("\n=== Testing 2: Smart Packing List ===");
  const packing = await makeRequest('/api/ai/generate-packing-list', {
    destination: "Paris",
    weather: "Chilly, 10-15°C",
    trip_duration: "2 days",
    traveler_type: "Couple",
    planned_activities: ["Museums", "Fine Dining"]
  });
  console.log(JSON.stringify(packing, null, 2));

  console.log("\n=== Testing 3: Budget Analysis ===");
  const budget = await makeRequest('/api/ai/analyze-budget', {
    destination: "Paris",
    total_budget: "$1500",
    planned_expenses: [{ category: "Hotel", amount: 600 }, { category: "Flight", amount: 400 }],
    daily_average_spending: "$250"
  });
  console.log(JSON.stringify(budget, null, 2));

  console.log("\n=== Testing 4: Activity Recommendation ===");
  const activities = await makeRequest('/api/ai/recommend-activities', {
    destination: "Paris",
    interests: ["Art", "Food"],
    budget: "$150",
    travel_style: "Relaxed"
  });
  console.log(JSON.stringify(activities, null, 2));

  console.log("\n=== Testing 5: Public Itinerary Enhancement ===");
  const publicItin = await makeRequest('/api/ai/enhance-itinerary', {
    destination: "Paris",
    duration: "2 days",
    activities: ["Louvre", "Eiffel Tower Dinner"]
  });
  console.log(JSON.stringify(publicItin, null, 2));

  console.log("\nAll tests completed!");
}

runTests();
