const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { topic } = JSON.parse(event.body);
    const apiKey = process.env.GEMINI_API_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-preview-0514:generateContent?key=${apiKey}`;

    // Prompt được cải tiến để cung cấp nhiều ngữ cảnh hơn cho AI, giúp giảm thiểu khả năng bị chặn
    const prompt = `
      You are an AI assistant for a language learning app designed for Vietnamese speakers.
      Your task is to generate a vocabulary set based on a user-provided topic.
      The topic is: "${topic}".

      Instructions:
      1. Generate a list of 5-7 vocabulary words and 3-4 simple, related example sentences.
      2. For each item, provide translations in Vietnamese (vi), English (en), and Korean (ko).
      3. Mark each item with its type: 'word' or 'sentence'.
      4. Ensure all content is family-friendly and suitable for language learners of all ages.
      5. Output the result ONLY as a JSON object with a single key "items", which is an array of objects. Each object should have keys: "vi", "en", "ko", "type".

      Example for topic "fruits":
      {
        "items": [
          {"vi": "quả táo", "en": "apple", "ko": "사과", "type": "word"},
          {"vi": "quả chuối", "en": "banana", "ko": "바나나", "type": "word"},
          {"vi": "Tôi thích ăn táo.", "en": "I like to eat apples.", "ko": "저는 사과 먹는 것을 좋아해요.", "type": "sentence"}
        ]
      }

      Now, generate the JSON for the topic "${topic}":
    `;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });

        const result = await response.json();

        // Xử lý trường hợp AI chặn yêu cầu hoặc không trả về nội dung
        if (!result.candidates || result.candidates.length === 0 || !result.candidates[0].content) {
            console.error("AI blocked request or returned empty response for topic:", topic);
            const errorMessage = result.promptFeedback?.blockReason || 'SAFETY_FILTERS';
            return {
                statusCode: 400,
                body: JSON.stringify({ error: `AI đã từ chối tạo chủ đề này vì lý do: ${errorMessage}. Vui lòng thử một chủ đề khác.` })
            };
        }
        
        const text = result.candidates[0].content.parts[0].text;
        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const jsonResponse = JSON.parse(cleanedText);

        return {
            statusCode: 200,
            body: JSON.stringify(jsonResponse)
        };
    } catch (error) {
        console.error("Error processing AI request:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Đã xảy ra lỗi khi giao tiếp với AI.' })
        };
    }
};

