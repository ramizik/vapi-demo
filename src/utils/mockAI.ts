// Mock AI responses for demonstration
const mockResponses = [
  "Hello! I'm your AI assistant. How can I help you today?",
  "That's an interesting question! Let me think about that for a moment.",
  "I understand what you're asking. Here's what I think...",
  "Great point! I'd be happy to help you with that.",
  "Thank you for sharing that with me. I appreciate your input.",
  "I see what you mean. Let me provide you with some information on that topic.",
  "That's a fascinating topic to explore. What would you like to know more about?",
  "I'm here to help! Feel free to ask me anything else.",
  "Excellent question! I'm glad you brought that up.",
  "I hope that helps! Is there anything else you'd like to discuss?"
];

export const getMockAIResponse = (userMessage: string): Promise<string> => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      resolve(randomResponse);
    }, 1000 + Math.random() * 1000); // 1-2 seconds delay
  });
};