import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
// No filesystem interaction needed now
import { File } from "openai/_shims/index.mjs";
import OpenAI from "openai";
import { ElevenLabsClient } from "elevenlabs";
import { performWebSearch, formatSearchResults } from "./utils/webSearch.js";

// Load environment variables from .env file if present
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const elevenlabs = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY });

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
            "You are ChatGPT, an advanced, friendly, and knowledgeable AI assistant. Answer user queries in a natural, conversational manner—just like ChatGPT on openai.com. Be helpful, concise when appropriate, and feel free to ask clarifying questions if needed. Avoid unnecessary mentions that you're an AI unless directly asked. When you need current information or want to search for specific topics, use the web_search function.",
        },
        ...messages,
      ],
      functions: [
        {
          name: "web_search",
          description: "Search the web for current information, news, facts, or any topic the user asks about",
          parameters: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description: "The search query to look up on the web"
              },
              max_results: {
                type: "number",
                description: "Maximum number of search results to return (default: 5)",
                default: 5
              }
            },
            required: ["query"]
          }
        }
      ],
      function_call: "auto",
      temperature: 0.7,
      max_tokens: 400,
    });

    const responseMessage = completion.choices[0].message;

    // Check if the model wants to call a function
    if (responseMessage.function_call) {
      const functionName = responseMessage.function_call.name;
      const functionArgs = JSON.parse(responseMessage.function_call.arguments);

      if (functionName === "web_search") {
        // Perform web search
        const searchResults = await performWebSearch(
          functionArgs.query,
          functionArgs.max_results || 5
        );

        const formattedResults = formatSearchResults(searchResults);

        // Send function result back to the model
        const secondCompletion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "You are ChatGPT, an advanced, friendly, and knowledgeable AI assistant. Answer user queries in a natural, conversational manner—just like ChatGPT on openai.com. Be helpful, concise when appropriate, and feel free to ask clarifying questions if needed. Avoid unnecessary mentions that you're an AI unless directly asked. When you need current information or want to search for specific topics, use the web_search function.",
            },
            ...messages,
            responseMessage,
            {
              role: "function",
              name: functionName,
              content: formattedResults,
            },
          ],
          temperature: 0.7,
          max_tokens: 500,
        });

        const finalText = secondCompletion.choices?.[0]?.message?.content?.trim();
        return res.json({ text: finalText });
      }
    }

    const text = responseMessage?.content?.trim();
    return res.json({ text });
  } catch (error) {
    console.error("Chat completion error", error);
    return res.status(500).json({ error: "Chat completion failed" });
  }
});

// NEW: Text-to-Speech endpoint
app.post("/api/tts", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    // Generate audio stream from ElevenLabs
    const audioStream = await elevenlabs.generate({
      voice: process.env.ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM", // Rachel voice
      model_id: "eleven_monolingual_v1",
      text,
    });

    // Set appropriate headers for audio streaming
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Transfer-Encoding", "chunked");

    // Pipe the audio stream to response
    for await (const chunk of audioStream) {
      res.write(chunk);
    }
    
    res.end();
  } catch (error) {
    console.error("TTS error", error);
    return res.status(500).json({ error: "TTS generation failed" });
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