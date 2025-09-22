//netlify/functions/get-tts.js
const { OpenAI } = require('openai');

// Chú ý: Cần cài đặt biến môi trường OPENAI_API_KEY trong Netlify
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.handler = async function (event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { text, lang } = JSON.parse(event.body);
    
    // Chọn giọng đọc của OpenAI dựa trên ngôn ngữ
    let voice = 'alloy'; // Giọng mặc định
    if (lang === 'ko') voice = 'nova';
    // OpenAI có nhiều giọng khác, bạn có thể thử nghiệm

    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: voice,
      input: text,
    });

    // Chuyển file audio thành dạng base64 để gửi về client
    const buffer = Buffer.from(await mp3.arrayBuffer());
    const base64Audio = buffer.toString('base64');

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ audio: base64Audio }),
    };
  } catch (error) {
    console.error('TTS Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to generate speech.' }),
    };
  }
};