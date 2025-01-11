import { useState } from "react";
import { Message } from "@/types/chat";
import { useMessages } from "./useMessages";
import { useMessageOperations } from "./useMessageOperations";
import { useChatInitialization } from "./useChatInitialization";

interface UseChatProps {
  initialTopic?: string;
  context?: string;
  improvement?: string;
  chatId?: string;
  isExistingChat?: boolean;
}

export const useChat = ({ 
  initialTopic, 
  context, 
  improvement,
  chatId,
  isExistingChat 
}: UseChatProps = {}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const { isInitialLoading, initializeChat } = useMessages({
    initialTopic,
    context,
    improvement,
    chatId,
    isExistingChat
  });

  const {
    input,
    setInput,
    isLoading,
    sendMessage,
    regenerateMessage
  } = useMessageOperations(chatId);

  const {
    showCreditAlert,
    setShowCreditAlert,
    handleNewMessage
  } = useChatInitialization(messages, chatId);

  const handleSendMessage = async () => {
    await sendMessage(messages, async (content) => {
      const assistantResponse = await handleNewMessage(input, content, messages);
      setMessages(prev => [...prev, assistantResponse]);
    });
  };

  return {
    input,
    setInput,
    isLoading,
    isInitialLoading,
    messages,
    showCreditAlert,
    setShowCreditAlert,
    sendMessage: handleSendMessage,
    initializeChat,
    regenerateMessage
  };
};