// netlify/functions/generate-set.js
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.handler = async function (event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { topic } = JSON.parse(event.body);

    const prompt = `
      Create a vocabulary list for kids about the topic "${topic}".
      Provide 15 to 20 words.
      Return the result as a JSON object with a key "words".
      Each word in the "words" array must be an object with three keys: "vi" (Vietnamese), "en" (English), and "ko" (Korean).

      Example for topic "fruits":
      {
        "words": [
          { "vi": "quả táo", "en": "Apple", "ko": "사과" },
          { "vi": "quả chuối", "en": "Banana", "ko": "바나나" }
        ]
      }

      Now, generate the list for the topic "${topic}":
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106", // Model này trả về JSON tốt
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }, // Yêu cầu trả về định dạng JSON
    });

    const content = JSON.parse(response.choices[0].message.content);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(content),
    };
  } catch (error) {
    console.error('AI Set Generation Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to generate vocabulary set.' }),
    };
  }
};