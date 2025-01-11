import { useState } from "react";
import { Message } from "@/types/chat";

export const useMessages = (initialTopic?: string, context?: string, improvement?: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const getInitialMessage = () => {
    if (context && improvement) {
      return `Hello! I understand you want to improve your ${improvement}. I'm here to help you on this journey. What specific aspects would you like to work on?`;
    }
    return "Hello! How can I help you today?";
  };

  const initializeChat = async () => {
    try {
      const initialMessage = getInitialMessage();
      setMessages([
        {
          id: "1",
          content: initialMessage,
          sender: "assistant",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsInitialLoading(false);
    }
  };

  return {
    messages,
    setMessages,
    isInitialLoading,
    initializeChat,
  };
};