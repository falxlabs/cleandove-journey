import { useState, useEffect } from "react";
import { Message } from "@/types/chat";
import { supabase } from "@/integrations/supabase/client";

interface UseMessagesProps {
  initialTopic?: string;
  context?: string;
  improvement?: string;
  chatId?: string;
  isExistingChat?: boolean;
}

export const useMessages = ({ 
  initialTopic, 
  context, 
  improvement,
  chatId,
  isExistingChat 
}: UseMessagesProps = {}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const getInitialMessage = (): string => {
    if (context && improvement) {
      return `Hello! I understand you want to improve your ${improvement}. I'm here to help you on this journey. What specific aspects would you like to work on?`;
    }
    if (initialTopic) {
      return `Hello! I see you want to discuss ${initialTopic}. How can I help you with that today?`;
    }
    return "Hello! How can I help you today?";
  };

  const loadExistingMessages = async () => {
    if (!chatId) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.error('No active session');
        return;
      }

      const { data: existingMessages, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('sequence_number', { ascending: true });

      if (error) {
        console.error('Error loading messages:', error);
        return;
      }

      if (existingMessages) {
        const formattedMessages: Message[] = existingMessages.map(msg => ({
          id: msg.id,
          content: msg.content,
          sender: msg.sender as "assistant" | "user",
          timestamp: new Date(msg.created_at)
        }));
        setMessages(formattedMessages);
      }
    } finally {
      setIsInitialLoading(false);
    }
  };

  const initializeChat = async () => {
    try {
      if (isExistingChat) {
        await loadExistingMessages();
      } else {
        const initialMessage: Message = {
          id: "1",
          content: getInitialMessage(),
          sender: "assistant",
          timestamp: new Date(),
        };
        setMessages([initialMessage]);
      }
    } finally {
      setIsInitialLoading(false);
    }
  };

  useEffect(() => {
    if (isExistingChat && chatId) {
      loadExistingMessages();
    } else {
      initializeChat();
    }
  }, [chatId, isExistingChat]);

  return {
    messages,
    setMessages,
    isInitialLoading,
    initializeChat,
  };
};