import { Message } from '../types';

const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const getChatAIResponse = async (messages: Message[]): Promise<string> => {
  // Convert to OpenAI roles
  const formatted = messages.map((m) => ({
    role: m.isUser ? 'user' : 'assistant',
    content: m.content,
  }));

  const res = await fetch(`${apiBase}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messages: formatted }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to get AI response');
  }
  return data.text as string;
}; 