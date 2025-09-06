// This file should be placed in: your_project_folder/netlify/functions/generate-set.js

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { topic } = JSON.parse(event.body);
    if (!topic) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Topic is required' }) };
    }

    const apiKey = process.env.GEMINI_API_KEY; 
    if (!apiKey) {
        console.error("API Key is missing from environment variables.");
        return { statusCode: 500, body: JSON.stringify({ error: 'API Key not configured on server' }) };
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
    
    const prompt = `You are an AI assistant for a language learning app for children (ages 6-12).
    Generate a list of 15 simple, common words or short, easy-to-understand sentences related to the topic: "${topic}".
    For each item, provide translations in Vietnamese, English, and Korean.
    For items that have a distinct sound (like animals), provide a simple representation of that sound in Vietnamese.
    The output MUST be a valid JSON object following the schema. Do not include any text, markdown, or explanations before or after the JSON object.`;

    const schema = {
      type: "OBJECT",
      properties: {
        words: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              vi: { type: "STRING", description: "Vietnamese translation" },
              en: { type: "STRING", description: "English translation" },
              ko: { type: "STRING", description: "Korean translation" },
              sound: { type: "STRING", description: "Optional sound in Vietnamese" }
            },
            required: ["vi", "en", "ko"]
          }
        }
      },
      required: ["words"]
    };

    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
      }
    };

    const geminiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!geminiResponse.ok) {
      const errorBody = await geminiResponse.text();
      console.error("Gemini API Error:", errorBody);
      return { statusCode: geminiResponse.status, body: JSON.stringify({ error: 'Failed to fetch from Gemini API', details: errorBody }) };
    }

    const result = await geminiResponse.json();
    const jsonText = result.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!jsonText) {
        console.error("No valid JSON content in Gemini response:", result);
        return { statusCode: 500, body: JSON.stringify({ error: "AI returned an empty response."})};
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: jsonText 
    };

  } catch (error) {
    console.error("Function Error:", error);
    return { 
        statusCode: 500, 
        body: JSON.stringify({ error: error.message }) 
    };
  }
};
