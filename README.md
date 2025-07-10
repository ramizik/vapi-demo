# Voice AI Assistant Demo
Ramis Hasanli for VAPI

A simple yet powerful Voice AI Assistant built with React and Node.js that demonstrates real-time speech-to-text, AI conversation, and text-to-speech capabilities.

## 🎯 Project Overview

This demo showcases a complete voice AI pipeline:
- **Voice Input**: Record audio through your microphone
- **Speech-to-Text**: Convert speech to text using OpenAI Whisper
- **AI Processing**: Generate intelligent responses using GPT-3.5-turbo with web search capabilities
- **Text-to-Speech**: Convert AI responses back to natural-sounding speech using ElevenLabs
- **Web Search**: Real-time information retrieval through DuckDuckGo integration

## 🏗️ Architecture

### Frontend (React + TypeScript)
- **React 18** with TypeScript for type safety
- **Tailwind CSS** for modern, responsive styling
- **Custom Hooks** for audio recording and TTS functionality
- **Real-time Audio Recording** with Web Audio API
- **Streaming Audio Playback** for AI responses

### Backend (Node.js + Express)
- **Express.js** server with CORS support
- **OpenAI Whisper API** for speech transcription
- **OpenAI GPT-3.5-turbo** for intelligent conversations
- **ElevenLabs API** for high-quality text-to-speech
- **DuckDuckGo Web Search** for real-time information
- **Multer** for handling audio file uploads

## 🚀 Features

- 🎤 **Voice Recording**: One-click recording with visual feedback
- 🗣️ **Speech Recognition**: Accurate transcription using OpenAI Whisper
- 🤖 **AI Conversations**: Natural dialogue with ChatGPT
- 🔍 **Web Search**: Automatic web search for current information
- 🔊 **Natural Speech**: High-quality voice synthesis with ElevenLabs
- 📱 **Responsive Design**: Works on desktop and mobile devices
- ⚡ **Real-time Processing**: Fast audio processing and response generation

## 📋 Prerequisites

- **Node.js** (version 16 or higher)
- **npm** package manager
- **API Keys** (provided separately):
  - OpenAI API key
  - ElevenLabs API key

## 🛠️ Installation & Setup

### 1. Download and Extract
```bash
# Download the project archive and extract it
# Navigate to the project directory
cd vapi-demo
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the main project folder with the following structure:

```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# ElevenLabs Configuration
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here

# Server Configuration
PORT=3001
```

**Note**: API keys will be provided separately for security reasons. Find them in Google Docs Project Report.

### 4. Running the Application

The application requires both frontend and backend to be running simultaneously.

#### Terminal 1 - Backend Server:
```bash
npm run server
```
This starts the Express server on `http://localhost:3001`

#### Terminal 2 - Frontend Development Server:
```bash
npm run dev
```
This starts the React development server on `http://localhost:5173`

### 5. Access the Application
Open your browser and navigate to `http://localhost:5173`

## 🎮 How to Use

1. **Click the "Record" button** to start voice recording
2. **Speak your question or message** clearly into the microphone
3. **Click "Stop Recording"** when finished
4. **Wait for processing**:
   - Your speech is transcribed to text
   - AI generates a response (may include web search if needed)
   - Response is converted to speech
5. **Listen to the AI response** as it plays automatically
6. **Continue the conversation** by recording another message

## 🔧 API Endpoints

### POST `/api/transcribe`
- **Purpose**: Convert audio to text using OpenAI Whisper
- **Input**: Audio file (WebM/WAV format)
- **Output**: Transcribed text

### POST `/api/chat`
- **Purpose**: Generate AI responses with optional web search
- **Input**: Array of conversation messages
- **Output**: AI-generated response text
- **Features**: Automatic web search integration

### POST `/api/tts`
- **Purpose**: Convert text to speech using ElevenLabs
- **Input**: Text string
- **Output**: Audio stream (MP3)

### GET `/api/health`
- **Purpose**: Health check endpoint
- **Output**: Server status

## 🧩 Key Dependencies

### Frontend
- `react` & `react-dom` - Core React framework
- `typescript` - Type safety and development experience
- `vite` - Fast build tool and development server
- `tailwindcss` - Utility-first CSS framework
- `lucide-react` - Modern icon library

### Backend
- `express` - Web framework for Node.js
- `openai` - OpenAI API client
- `elevenlabs` - ElevenLabs API client
- `multer` - File upload handling
- `axios` - HTTP client for web search
- `cheerio` - HTML parsing for search results
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variable management

## 🔍 Web Search Integration

The AI can automatically perform web searches when it needs current information:
- Uses **DuckDuckGo** as the search engine
- Automatically triggered when AI determines search is needed
- Returns up to 5 relevant results
- Integrates search results into AI responses
- Includes fallback handling for search failures

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface
- **Visual Feedback**: Recording status indicators
- **Responsive Layout**: Adapts to different screen sizes
- **Status Updates**: Real-time processing status
- **Audio Controls**: Intuitive recording and playback
- **Message History**: Conversation flow display

## 🚨 Troubleshooting

### Common Issues:
1. **"No audio input detected"**: Check microphone permissions in browser
2. **"API key error"**: Verify `.env` file is created with correct keys
3. **"Server connection failed"**: Ensure backend is running on port 3001
4. **"Audio playback issues"**: Check browser audio settings

### Port Conflicts:
- Frontend default: `http://localhost:5173`
- Backend default: `http://localhost:3001`
- Modify `PORT` in `.env` if needed

## 📝 Development Notes

- Built with modern ES6+ JavaScript and TypeScript
- Uses React 18 features including hooks and concurrent features
- Implements proper error handling and loading states
- Follows REST API conventions
- Includes comprehensive type definitions
- Optimized for development and production builds

## 🔒 Security Considerations

- API keys are stored in environment variables
- CORS properly configured for development
- File uploads are handled securely with Multer
- No sensitive data stored in client-side code

## 📄 License

This is a demo project for educational and review purposes.