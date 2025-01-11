import { useState } from "react";
import { Message } from "@/types/chat";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { checkCredits, deductCredit } from "@/utils/credits";

export const useChat = (initialTopic?: string) => {
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showCreditAlert, setShowCreditAlert] = useState(false);

  const initializeChat = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: chatHistory, error: chatError } = await supabase
        .from("chat_histories")
        .insert({
          title: initialTopic || "New Chat",
          preview: "Hello! How can I help you today?",
          user_id: user.id,
        })
        .select()
        .single();

      if (chatError) throw chatError;

      setChatId(chatHistory.id);

      const { error: messageError } = await supabase
        .from("messages")
        .insert({
          chat_id: chatHistory.id,
          content: "Hello! How can I help you today?",
          sender: "assistant",
          sequence_number: 1,
        });

      if (messageError) throw messageError;

      setMessages([
        {
          id: "1",
          content: "Hello! How can I help you today?",
          sender: "assistant",
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Error creating chat:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to start new chat. Please try again.",
      });
    } finally {
      setIsInitialLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !chatId) return;

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
      const { error: messageError } = await supabase
        .from("messages")
        .insert({
          chat_id: chatId,
          content: input,
          sender: "user",
          sequence_number: messages.length + 1,
        });

      if (messageError) throw messageError;

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

      const { error: assistantMessageError } = await supabase
        .from("messages")
        .insert({
          chat_id: chatId,
          content: data.content,
          sender: "assistant",
          sequence_number: messages.length + 2,
        });

      if (assistantMessageError) throw assistantMessageError;

      const { error: updateError } = await supabase
        .from("chat_histories")
        .update({
          preview: data.content,
          reply_count: messages.length + 2,
        })
        .eq("id", chatId);

      if (updateError) throw updateError;

      setMessages((prev) => [...prev, assistantResponse]);
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
  };
};