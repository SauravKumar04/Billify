const axios = require("axios");

const DEFAULT_MODEL = "llama-3.1-8b-instant";
const GROQ_TIMEOUT_MS = 30000;

const sanitizeGeneratedText = (value) => {
  return String(value || "").replace(/\s+/g, " ").trim();
};

const generateWithGroq = async (prompt) => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is missing");
  }

  const model = process.env.GROQ_MODEL || DEFAULT_MODEL;

  try {
    const { data } = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 180,
        temperature: 0.35,
        top_p: 0.9,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        timeout: GROQ_TIMEOUT_MS,
      }
    );

    const message = data?.choices?.[0]?.message?.content;
    const cleaned = sanitizeGeneratedText(message);
    if (!cleaned) {
      throw new Error("No generated text returned from Groq");
    }

    return cleaned;
  } catch (error) {
    const status = error?.response?.status;
    if (status) {
      throw new Error(`Groq request failed with status ${status}`);
    }
    throw new Error(error?.message || "Groq request failed");
  }
};

module.exports = { generateWithGroq };
