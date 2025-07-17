// server.mjs
import cors from "cors";
import express from "express";
import fetch from "node-fetch";
const PORT = 3000;

const app = express();
app.use(cors());
app.use(express.json());

let conversationHistory = [];

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;
  console.log("Received from frontend:", userMessage);

  try {
    const apiResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer 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"
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct:free",

        messages: [{ role: "user", content: userMessage }]
      })
    });

    const data = await apiResponse.json();
    console.log("OpenRouter response:", data);

    const botReply = data?.choices?.[0]?.message?.content ?? "⚠️ No response from model.";
    res.json({ reply: botReply });

  } catch (err) {
    console.error("Backend error:", err.message);
    res.status(500).json({ reply: `⚠️ Server error: ${err.message}` });
  }
})
app.get("/", (req, res) => {
  res.send("✅ Backend is running!");
});

  app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
  
});


