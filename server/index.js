import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import fs from "fs";
import path from "path";
import os from "os";
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

    // Write buffer to a temp file (Whisper requires a ReadStream)
    const tempDir = os.tmpdir();
    const tempPath = path.join(tempDir, `${Date.now()}-${req.file.originalname}`);
    fs.writeFileSync(tempPath, req.file.buffer);

    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(tempPath),
      model: "whisper-1",
    });

    // Remove temp file
    fs.unlinkSync(tempPath);

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