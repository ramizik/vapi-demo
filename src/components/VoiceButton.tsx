import React from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';

interface VoiceButtonProps {
  isListening: boolean;
  isProcessing: boolean;
  onStartListening: () => void;
  onStopListening: () => void;
  disabled?: boolean;
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({
  isListening,
  isProcessing,
  onStartListening,
  onStopListening,
  disabled = false
}) => {
  const handleClick = () => {
    if (isListening) {
      onStopListening();
    } else {
      onStartListening();
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isProcessing}
      className={`
        relative w-16 h-16 rounded-full flex items-center justify-center
        transition-all duration-300 transform hover:scale-105 active:scale-95
        shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed
        ${isListening 
          ? 'bg-gradient-to-r from-red-500 to-red-600 text-white animate-pulse' 
          : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700'
        }
      `}
    >
      {isProcessing ? (
        <Loader2 className="w-6 h-6 animate-spin" />
      ) : isListening ? (
        <MicOff className="w-6 h-6" />
      ) : (
        <Mic className="w-6 h-6" />
      )}
      
      {isListening && (
        <div className="absolute inset-0 rounded-full border-4 border-red-300 animate-ping" />
      )}
    </button>
  );
};