import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { checkCredits, deductCredit } from "@/utils/credits";
import { useMessages } from "./useMessages";
import { useChatHistory } from "./useChatHistory";
import { useChatTitle } from "./useChatTitle";
import { Message } from "@/types/chat";

interface UseChatProps {
  initialTopic?: string;
  context?: string;
  improvement?: string;
}

export const useChat = ({ initialTopic, context, improvement }: UseChatProps = {}) => {
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCreditAlert, setShowCreditAlert] = useState(false);

  const { messages, setMessages, isInitialLoading, initializeChat } = useMessages(
    initialTopic,
    context,
    improvement
  );
  const { chatId, setChatId, createChatHistory, saveMessages, updateExistingChat } =
    useChatHistory();
  const { chatTitle, generateTitle } = useChatTitle(initialTopic);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const hasCredits = await checkCredits();
    if (!hasCredits) {
      setShowCreditAlert(true);
      return;
    }

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
      const { data, error } = await supabase.functions.invoke('chat', {
        body: { messages: [...messages, newMessage] }
      });

      if (error) throw error;

      const creditDeducted = await deductCredit();
      if (!creditDeducted) {
        throw new Error("Failed to deduct credit");
      }

      const assistantResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: data.content,
        sender: "assistant",
        timestamp: new Date(),
      };

      if (!chatId) {
        const newChatId = await createChatHistory(input, data.content);
        if (newChatId) {
          setChatId(newChatId);
          await saveMessages(newChatId, messages, input, data.content);
          await generateTitle([...messages, newMessage, assistantResponse], newChatId);
        }
      } else {
        await updateExistingChat(chatId, input, data.content, messages.length);
      }

      setMessages(prev => [...prev, assistantResponse]);

    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message. Please try again.",
      });
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