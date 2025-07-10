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

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}`);
}); 