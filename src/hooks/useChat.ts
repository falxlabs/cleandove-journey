import { useState } from "react";
import { Message } from "@/types/chat";
import { useMessages } from "./useMessages";
import { useChatHistory } from "./useChatHistory";
import { useChatTitle } from "./useChatTitle";
import { useCredits } from "./useCredits";
import { useChatOperations } from "./useChatOperations";

interface UseChatProps {
  initialTopic?: string;
  context?: string;
  improvement?: string;
}

export const useChat = ({ initialTopic, context, improvement }: UseChatProps = {}) => {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { messages, setMessages, isInitialLoading, initializeChat } = useMessages(
    initialTopic,
    context,
    improvement
  );
  const { chatId, setChatId, createChatHistory, saveMessages, updateExistingChat } =
    useChatHistory();
  const { chatTitle, generateTitle } = useChatTitle(initialTopic);
  const { showCreditAlert, setShowCreditAlert, handleCredits } = useCredits();
  const { sendChatMessage } = useChatOperations();

  const sendMessage = async () => {
    if (!input.trim()) return;

    const creditsAvailable = await handleCredits();
    if (!creditsAvailable) return;

    setIsLoading(true);
    const newMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    try {
      const content = await sendChatMessage([...messages, newMessage]);

      const assistantResponse: Message = {
        id: (Date.now() + 1).toString(),
        content,
        sender: "assistant",
        timestamp: new Date(),
      };

      if (!chatId) {
        const newChatId = await createChatHistory(input, content);
        if (newChatId) {
          setChatId(newChatId);
          await saveMessages(newChatId, messages, input, content);
          await generateTitle([...messages, newMessage, assistantResponse], newChatId);
        }
      } else {
        await updateExistingChat(chatId, input, content, messages.length);
      }

      setMessages(prev => [...prev, assistantResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const regenerateMessage = async (messageId: string) => {
    // Implementation for message regeneration
    // This will be implemented in a future update
    console.log("Regenerate message:", messageId);
  };

  return {
    input,
    setInput,
    isLoading,
    isInitialLoading,
    messages,
    showCreditAlert,
    setShowCreditAlert,
    sendMessage,
    initializeChat,
    regenerateMessage,
    chatTitle
  };
};