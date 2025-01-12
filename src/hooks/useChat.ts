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
    const currentInput = input;
    setInput("");

    try {
      const content = await sendMessage([...messages, newMessage]);
      if (content) {
        const messageParts = content.split("[NEXT]").map(part => part.trim()).filter(Boolean);
        let lastMessage: Message | undefined;
        
        for (const [index, part] of messageParts.entries()) {
          const assistantResponse: Message = {
            id: (Date.now() + index + 1).toString(),
            content: part,
            sender: "assistant",
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, assistantResponse]);
          lastMessage = assistantResponse;
          
          // Only add a small delay between parts if there are multiple
          if (messageParts.length > 1 && index < messageParts.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        }
        
        if (lastMessage) {
          await handleNewMessage(currentInput, content, messages);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
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