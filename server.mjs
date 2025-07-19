// server.mjs
import cors from "cors";
import dotenv from 'dotenv';
import express from "express";
import fetch from "node-fetch";
const PORT = 3000;
dotenv.config();

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
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`
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
  console.log(`✅ Server is running at D${PORT}`);
  
});


