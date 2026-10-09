const axios = require("axios");

exports.askAI = async (req, res) => {
  try {
    const { message } = req.body;

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ message: "GROQ_API_KEY не найден в .env" });
    }

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content:
              "Ты AI помощник образовательной платформы AIvolution. Объясняй темы просто, понятно и по-русски.",
          },
          {
            role: "user",
            content: message,
          },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({
      reply: response.data.choices[0].message.content,
    });
  } catch (err) {
    console.error("AI error:", err.response?.data || err.message);

    res.status(500).json({
      message: "Ошибка AI",
      error: err.response?.data?.error?.message || err.message,
    });
  }
};