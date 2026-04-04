const { GoogleGenerativeAI } = require('@google/generative-ai');
const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyAzvx6FW8m_AJk1QKSCHH0BKvF7btCBB_A';
const genAI = new GoogleGenerativeAI(apiKey);
async function test() {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const chat = model.startChat();
    const result = await chat.sendMessage('hello');
    console.log(result.response.text());
  } catch (err) {
    console.error('FULL_ERROR:', err);
  }
}
test();
