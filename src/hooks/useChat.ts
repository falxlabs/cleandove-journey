import { useState } from "react";
import { Message } from "@/types/chat";
import { useMessages } from "./useMessages";
import { useMessageOperations } from "./useMessageOperations";
import { useChatInitialization } from "./useChatInitialization";
import { useChatTitle } from "./useChatTitle";

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
    isExistingChat,
    setMessages
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

  const { chatTitle } = useChatTitle(initialTopic);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);

    try {
      const content = await sendMessage([...messages, newMessage]);
      if (content) {
        const assistantResponse = await handleNewMessage(input, content, messages);
        setMessages(prev => [...prev, assistantResponse]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Remove the user message if the API call failed
      setMessages(prev => prev.filter(msg => msg.id !== newMessage.id));
    }
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
    regenerateMessage,
    chatTitle
  };
};