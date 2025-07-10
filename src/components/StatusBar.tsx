import React from 'react';

// Keep props for compatibility but they are no longer used
interface StatusBarProps {
  isListening?: boolean;
  isSpeaking?: boolean;
  isProcessing?: boolean;
  error?: string | null;
  isSupported?: boolean;
}

export const StatusBar: React.FC<StatusBarProps> = () => {
  return (
    <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
      <div className="max-w-4xl mx-auto flex items-center justify-between text-sm text-gray-600">
        <span>Ramis Hasanli for VAPI</span>
        <a
          href="https://www.linkedin.com/in/hasanliramis/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          LinkedIn
        </a>
      </div>
    </div>
  );
};