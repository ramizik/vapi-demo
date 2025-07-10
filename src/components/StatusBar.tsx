import React from 'react';
import { Volume2, VolumeX, Wifi, WifiOff } from 'lucide-react';

interface StatusBarProps {
  isListening: boolean;
  isSpeaking: boolean;
  isProcessing: boolean;
  error: string | null;
  isSupported: boolean;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  isListening,
  isSpeaking,
  isProcessing,
  error,
  isSupported
}) => {
  const getStatusText = () => {
    if (error) return error;
    if (isProcessing) return 'Processing...';
    if (isListening) return 'Listening...';
    if (isSpeaking) return 'Speaking...';
    return 'Ready to chat';
  };

  const getStatusColor = () => {
    if (error) return 'text-red-500';
    if (isProcessing) return 'text-yellow-500';
    if (isListening) return 'text-red-500';
    if (isSpeaking) return 'text-blue-500';
    return 'text-green-500';
  };

  return (
    <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`flex items-center space-x-2 ${getStatusColor()}`}>
            <div className="w-2 h-2 rounded-full bg-current" />
            <span className="text-sm font-medium">{getStatusText()}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-gray-500">
            {isSpeaking ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
            <span className="text-xs">Audio</span>
          </div>
          
          <div className="flex items-center space-x-2 text-gray-500">
            {isSupported ? (
              <Wifi className="w-4 h-4" />
            ) : (
              <WifiOff className="w-4 h-4" />
            )}
            <span className="text-xs">Connection</span>
          </div>
        </div>
      </div>
    </div>
  );
};