import React, { useState, useEffect, useCallback } from 'react';
import { ChatContainer } from './components/ChatContainer';
import { VoiceButton } from './components/VoiceButton';
import { StatusBar } from './components/StatusBar';
import { useAudioRecorder } from './hooks/useAudioRecorder';
import { useTextToSpeech } from './hooks/useTextToSpeech';
import { getMockAIResponse } from './utils/mockAI';
import { Message, VoiceState } from './types';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [voiceState, setVoiceState] = useState<VoiceState>({
    isListening: false,
    isProcessing: false,
    isSpeaking: false,
    error: null
  });

  const {
    isRecording,
    startRecording,
    stopRecording,
    error: recordingError
  } = useAudioRecorder();

  const {
    speak,
    isSpeaking,
    stop: stopSpeaking,
    isSupported: speechSynthesisSupported
  } = useTextToSpeech();

  // Update voice state based on hooks
  useEffect(() => {
    setVoiceState(prev => ({
      ...prev,
      isListening: isRecording,
      isSpeaking,
      error: recordingError
    }));
  }, [isRecording, isSpeaking, recordingError]);

  const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');

    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    const res = await fetch(`${apiBase}/api/transcribe`, { method: 'POST', body: formData });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to transcribe');
    }
    return data.text as string;
  };

  const handleUserMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;

    setVoiceState(prev => ({ ...prev, isProcessing: true }));

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: message.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      // Get AI response (mock for now)
      const aiResponse = await getMockAIResponse(message);
      
      // Add AI message
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);

      // Speak the AI response
      if (speechSynthesisSupported) {
        speak(aiResponse);
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      setVoiceState(prev => ({ 
        ...prev, 
        error: 'Failed to get AI response. Please try again.' 
      }));
    } finally {
      setVoiceState(prev => ({ ...prev, isProcessing: false }));
    }
  }, [speak, speechSynthesisSupported]);

  const handleStartListening = useCallback(() => {
    if (isSpeaking) {
      stopSpeaking();
    }
    setVoiceState(prev => ({ ...prev, error: null }));
    startRecording();
  }, [startRecording, isSpeaking, stopSpeaking]);

  const handleStopListening = useCallback(async () => {
    const audioBlob = await stopRecording();
    if (!audioBlob) return;

    setVoiceState(prev => ({ ...prev, isProcessing: true }));

    try {
      const text = await transcribeAudio(audioBlob);
      await handleUserMessage(text);
    } catch (err) {
      console.error(err);
      setVoiceState(prev => ({ ...prev, error: 'Transcription failed' }));
    } finally {
      setVoiceState(prev => ({ ...prev, isProcessing: false }));
    }
  }, [stopRecording, handleUserMessage]);

  const isSupported = !!navigator.mediaDevices && speechSynthesisSupported;

  if (!isSupported) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-800 mb-2">
            Browser Not Supported
          </h1>
          <p className="text-gray-600 mb-4">
            Your browser doesn't support speech recognition or text-to-speech. Please use a modern browser like Chrome, Firefox, or Safari.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Voice AI Assistant
              </h1>
              <p className="text-gray-600 mt-1">
                Speak naturally and get intelligent responses
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                {messages.length} {messages.length === 1 ? 'message' : 'messages'}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <ChatContainer messages={messages} />

      {/* Voice Controls */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto flex justify-center">
          <VoiceButton
            isListening={voiceState.isListening}
            isProcessing={voiceState.isProcessing}
            onStartListening={handleStartListening}
            onStopListening={handleStopListening}
            disabled={!isSupported}
          />
        </div>
      </div>

      {/* Status Bar */}
      <StatusBar
        isListening={voiceState.isListening}
        isSpeaking={voiceState.isSpeaking}
        isProcessing={voiceState.isProcessing}
        error={voiceState.error}
        isSupported={isSupported}
      />
    </div>
  );
}

export default App;