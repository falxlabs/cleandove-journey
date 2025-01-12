import { useState } from "react";
import { Message } from "@/types/chat";
import { useMessages } from "./useMessages";
import { useMessageOperations } from "./useMessageOperations";
import { useChatInitialization } from "./useChatInitialization";
import { useChatTitle } from "./useChatTitle";
import { splitMessage } from "@/utils/messageUtils";

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

  const addMessageWithDelay = async (content: string, index: number, totalParts: number) => {
    const delay = index * 1000; // 1 second delay between messages
    await new Promise(resolve => setTimeout(resolve, delay));

    const assistantResponse: Message = {
      id: `${Date.now()}-${index}`,
      content,
      sender: "assistant",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, assistantResponse]);
    return assistantResponse;
  };

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
        // Split the AI response into multiple parts
        const messageParts = splitMessage(content);
        
        // Add each part as a separate message with a delay
        for (let i = 0; i < messageParts.length; i++) {
          await addMessageWithDelay(messageParts[i], i, messageParts.length);
        }
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