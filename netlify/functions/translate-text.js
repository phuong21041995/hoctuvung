// Netlify function to translate text using Gemini API
const fetch = require('node-fetch');

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  try {
    const { text, sourceLang, targetLang } = JSON.parse(event.body);
    const apiKey = process.env.GEMINI_API_KEY;

    if (!text || !sourceLang || !targetLang || !apiKey) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing parameters or API key.' }) };
    }
    
    const langMap = { 'vi': 'Vietnamese', 'en': 'English', 'ko': 'Korean' };
    const prompt = `Translate the following text from ${langMap[sourceLang]} to ${langMap[targetLang]}. Only return the translated text, without any explanations or quotation marks.\n\nText: "${text}"`;
    
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
    
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    
    if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
    }

    const result = await response.json();
    const translatedText = result.candidates[0].content.parts[0].text;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ translatedText: translatedText.trim() }),
    };

  } catch (error) {
    console.error("Function Error:", error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
