const OpenAI = require('openai');

let _openai;
const getOpenAI = () => {
  if (!_openai) _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return _openai;
};

// Proxy so callers can do `openai.chat.completions.create(...)` as before
const openai = new Proxy({}, {
  get(_, prop) {
    return getOpenAI()[prop];
  },
});

const tts = async (text) => {
  const client = getOpenAI();
  const mp3 = await client.audio.speech.create({
    model: 'tts-1',
    voice: 'alloy',
    input: text,
  });
  const buffer = Buffer.from(await mp3.arrayBuffer());
  return buffer.toString('base64');
};

module.exports = { openai, tts };
