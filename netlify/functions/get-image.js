// Netlify function to get an image, trying Wikipedia first, then generating with AI
const fetch = require('node-fetch');

// Helper to fetch from Wikipedia
async function getWikipediaImage(term) {
  try {
    const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(term)}`;
    const response = await fetch(summaryUrl, { headers: { 'Accept': 'application/json' }});
    if (!response.ok) return null;
    const data = await response.json();
    // Return original image URL if it exists and is not a default/placeholder SVG
    if (data.originalimage?.source && !data.originalimage.source.endsWith('.svg')) {
      return data.originalimage.source;
    }
    return null;
  } catch (error) {
    console.error("Wikipedia fetch error:", error);
    return null;
  }
}

// Helper to generate image with Imagen
async function generateAiImage(item, apiKey) {
  const prompt = `A simple, cute, minimalist cartoon illustration of "${item.en}". Clean background, friendly for a kids language learning app.`;
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`;

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ instances: [{ prompt: prompt }], parameters: { "sampleCount": 1 } })
  });

  if (!response.ok) {
    throw new Error(`Imagen API call failed with status: ${response.status}`);
  }
  
  const result = await response.json();
  if (result.predictions && result.predictions[0]?.bytesBase64Encoded) {
    return `data:image/png;base64,${result.predictions[0].bytesBase64Encoded}`;
  }
  
  throw new Error("AI image generation failed to return data.");
}


exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { item } = JSON.parse(event.body);
    const apiKey = process.env.GEMINI_API_KEY;

    if (!item || !apiKey) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing item or API key.' }) };
    }

    // 1. Try Wikipedia first
    let imageUrl = await getWikipediaImage(item.en);
    
    // 2. If Wikipedia fails, use AI
    if (!imageUrl) {
      console.log(`Wikipedia image not found for "${item.en}", generating with AI.`);
      imageUrl = await generateAiImage(item, apiKey);
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl }),
    };

  } catch (error) {
    console.error("Function Error:", error);
    const fallbackUrl = `https://placehold.co/600x400/eef5ff/6b7b93?text=Error`;
    return { 
        statusCode: 200, // Return 200 with fallback to prevent app from breaking
        body: JSON.stringify({ imageUrl: fallbackUrl }) 
    };
  }
};
