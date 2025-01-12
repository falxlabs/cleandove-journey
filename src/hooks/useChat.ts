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

  const addMessageWithDelay = async (content: string, delay: number = 500) => {
    const assistantResponse: Message = {
      id: Date.now().toString(),
      content,
      sender: "assistant",
      timestamp: new Date(),
    };
    
    await new Promise(resolve => setTimeout(resolve, delay));
    setMessages(prev => [...prev, assistantResponse]);
    return assistantResponse;
  };

  const splitMessage = (content: string): string[] => {
    return content.split("[NEXT]").map(part => part.trim()).filter(Boolean);
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
    const currentInput = input; // Store current input
    setInput(""); // Clear input immediately after sending

    try {
      const content = await sendMessage([...messages, newMessage]);
      if (content) {
        const messageParts = splitMessage(content);
        let lastMessage: Message | undefined;
        
        for (const [index, part] of messageParts.entries()) {
          lastMessage = await addMessageWithDelay(part, index * 1000);
        }
        
        if (lastMessage) {
          await handleNewMessage(currentInput, content, messages);
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