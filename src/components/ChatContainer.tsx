import React, { useEffect, useRef } from 'react';
import { ChatMessage } from './ChatMessage';
import { Message } from '../types';

interface ChatContainerProps {
  messages: Message[];
}

export const ChatContainer: React.FC<ChatContainerProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="max-w-4xl mx-auto">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4 text-3xl">
              🤖
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
             👋 Hi! I'm Verapi, your personal AI assistant! What awaits us today?
            </h3>
            <p className="text-gray-600">
             🎙️ Press the microphone button and start speaking naturally.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message.content}
                isUser={message.isUser}
                timestamp={message.timestamp}
              />
            ))}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};