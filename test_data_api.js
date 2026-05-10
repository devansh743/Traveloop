const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
};

const makeGetRequest = (path) => {
  return new Promise((resolve, reject) => {
    const req = http.request({ ...options, path, method: 'GET' }, (res) => {
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
    req.end();
  });
};

async function runTests() {
  console.log("Starting Data API tests...\n");

  console.log("=== Testing 1: Weather API (OpenWeather) ===");
  const weather = await makeGetRequest('/api/data/weather?city=Paris');
  console.log(JSON.stringify(weather, null, 2));

  console.log("\n=== Testing 2: Photos API (Unsplash) ===");
  const photos = await makeGetRequest('/api/data/photos?city=Paris');
  console.log(JSON.stringify(photos, null, 2));

  console.log("\nAll tests completed!");
}

runTests();
