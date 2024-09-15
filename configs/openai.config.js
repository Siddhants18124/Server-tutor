const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Your OpenAI API key
});

module.exports = openai;
