import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
// No filesystem interaction needed now
import { File } from "openai/_shims/index.mjs";
import OpenAI from "openai";

// Load environment variables from .env file if present
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Multer config (store in memory)
const upload = multer({ storage: multer.memoryStorage() });

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// NEW: Transcribe endpoint
app.post("/api/transcribe", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No audio file uploaded" });
    }

    // Convert buffer to File object understood by OpenAI SDK
    const fileForUpload = new File([req.file.buffer], req.file.originalname || "audio.webm", {
      type: req.file.mimetype || "audio/webm",
    });

    const transcription = await openai.audio.transcriptions.create({
      file: fileForUpload,
      model: "whisper-1",
    });

    return res.json({ text: transcription.text });
  } catch (error) {
    console.error("Transcription error", error);
    return res.status(500).json({ error: "Transcription failed" });
  }
});

// NEW: Chat endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: "messages array required" });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are ChatGPT, an advanced, friendly, and knowledgeable AI assistant. Answer user queries in a natural, conversational manner—just like ChatGPT on openai.com. Be helpful, concise when appropriate, and feel free to ask clarifying questions if needed. Avoid unnecessary mentions that you’re an AI unless directly asked.",
        },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 400,
    });

    const text = completion.choices?.[0]?.message?.content?.trim();
    return res.json({ text });
  } catch (error) {
    console.error("Chat completion error", error);
    return res.status(500).json({ error: "Chat completion failed" });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}`);
}); 