const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy_key');

/**
 * Generic function to call Gemini and return structured JSON
 * @param {string} prompt - The prompt to send to Gemini
 * @returns {Promise<Object>} - Parsed JSON response
 */
async function generateJsonFromGemini(prompt) {
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
    throw new Error('GEMINI_API_KEY is not configured. Please add it to your .env file.');
  }

  try {
    // For general text tasks, we use gemini-2.5-flash which is available on your key
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
      },
    });

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    // Parse the JSON string from Gemini
    return JSON.parse(text);
  } catch (error) {
    console.error('Error in Gemini API call:', error);
    throw error;
  }
}

module.exports = {
  generateJsonFromGemini
};
