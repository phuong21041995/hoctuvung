// This file should be placed in: your_project_folder/netlify/functions/get-description.js

exports.handler = async function(event) {
  // Chỉ cho phép phương thức POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { name } = JSON.parse(event.body);
    if (!name) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Name is required' }) };
    }

    // Lấy API Key từ biến môi trường của Netlify một cách an toàn
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("API Key is missing from environment variables.");
      return { statusCode: 500, body: JSON.stringify({ error: 'API Key not configured on server' }) };
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
    
    // Câu lệnh yêu cầu AI tạo mô tả
    const prompt = `Viết một câu mô tả thật ngắn gọn (dưới 20 từ), vui nhộn, phù hợp cho trẻ em Việt Nam (5-10 tuổi) về "${name}".`;

    // Gửi yêu cầu đến Gemini API
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API Error:", errorText);
      return { statusCode: response.status, body: JSON.stringify({ error: 'Failed to fetch from Gemini API' }) };
    }

    const result = await response.json();
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text || "Oops! Chưa có thông tin.";

    // Trả về mô tả cho ứng dụng
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description: text.replace(/[*#]/g, '') }) // Xóa các ký tự markdown
    };
  } catch (error) {
    console.error("Function Error:", error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};

