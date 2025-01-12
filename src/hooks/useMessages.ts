import { useState, useEffect } from "react";
import { Message } from "@/types/chat";
import { supabase } from "@/integrations/supabase/client";

interface UseMessagesProps {
  initialTopic?: string;
  context?: string;
  improvement?: string;
  chatId?: string;
  isExistingChat?: boolean;
  setMessages: (messages: Message[]) => void;
}

export const useMessages = ({ 
  chatId,
  isExistingChat,
  setMessages 
}: UseMessagesProps) => {
  const [isInitialLoading, setIsInitialLoading] = useState(false);

  const getInitialMessage = (): Message => ({
    id: "1",
    content: "Hello! I'm Pace, your personal accountability partner. I'm here to help you stay on track with your goals and build better habits. How can I assist you today?",
    sender: "assistant",
    timestamp: new Date(),
  });

  const loadExistingMessages = async () => {
    if (!chatId) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.error('No active session');
        return;
      }

      setIsInitialLoading(true);
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
    } catch (error) {
      console.error('Error in loadExistingMessages:', error);
    } finally {
      setIsInitialLoading(false);
    }
  };

  const initializeChat = async () => {
    try {
      if (isExistingChat) {
        await loadExistingMessages();
      } else {
        const initialMessage = getInitialMessage();
        setMessages([initialMessage]);
      }
    } catch (error) {
      console.error('Error in initializeChat:', error);
    }
  };

  useEffect(() => {
    initializeChat();
  }, [chatId, isExistingChat]);

  return {
    isInitialLoading,
    initializeChat,
  };
};