import { useState } from "react";
import { Message } from "@/types/chat";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { checkCredits, deductCredit } from "@/utils/credits";

interface UseChatProps {
  initialTopic?: string;
  context?: string;
  improvement?: string;
}

export const useChat = ({ initialTopic, context, improvement }: UseChatProps = {}) => {
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showCreditAlert, setShowCreditAlert] = useState(false);
  const [chatTitle, setChatTitle] = useState<string>(initialTopic || "New Chat");

  const getInitialMessage = () => {
    if (context && improvement) {
      return `Hello! I understand you want to improve your ${improvement}. I'm here to help you on this journey. What specific aspects would you like to work on?`;
    }
    return "Hello! How can I help you today?";
  };

  const generateTitle = async (messages: Message[]) => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-title', {
        body: { messages }
      });

      if (error) throw error;
      if (data.title) {
        setChatTitle(data.title);
        if (chatId) {
          await supabase
            .from("chat_histories")
            .update({ title: data.title })
            .eq("id", chatId);
        }
      }
    } catch (error) {
      console.error('Error generating title:', error);
    }
  };

  const initializeChat = async () => {
    try {
      const initialMessage = getInitialMessage();
      setMessages([
        {
          id: "1",
          content: initialMessage,
          sender: "assistant",
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Error initializing chat:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to start new chat. Please try again.",
      });
    } finally {
      setIsInitialLoading(false);
    }
  };

  const createChatHistory = async (userMessage: string, assistantMessage: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: chatHistory, error: chatError } = await supabase
      .from("chat_histories")
      .insert({
        title: initialTopic || "New Chat",
        preview: assistantMessage,
        user_id: user.id,
      })
      .select()
      .single();

    if (chatError) throw chatError;
    return chatHistory.id;
  };

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

      // Create chat history only after first user message
      if (!chatId) {
        const newChatId = await createChatHistory(input, data.content);
        if (newChatId) {
          setChatId(newChatId);
          
          // Insert initial assistant message
          await supabase
            .from("messages")
            .insert({
              chat_id: newChatId,
              content: messages[0].content,
              sender: "assistant",
              sequence_number: 1,
            });

          // Insert user message
          await supabase
            .from("messages")
            .insert({
              chat_id: newChatId,
              content: input,
              sender: "user",
              sequence_number: 2,
            });

          // Insert assistant response
          await supabase
            .from("messages")
            .insert({
              chat_id: newChatId,
              content: data.content,
              sender: "assistant",
              sequence_number: 3,
            });

          // Generate title after chat creation
          await generateTitle([...messages, newMessage, assistantResponse]);
        }
      } else {
        // Regular message flow for existing chat
        await supabase
          .from("messages")
          .insert({
            chat_id: chatId,
            content: input,
            sender: "user",
            sequence_number: messages.length + 1,
          });

        await supabase
          .from("messages")
          .insert({
            chat_id: chatId,
            content: data.content,
            sender: "assistant",
            sequence_number: messages.length + 2,
          });

        await supabase
          .from("chat_histories")
          .update({
            preview: data.content,
            reply_count: messages.length + 2,
          })
          .eq("id", chatId);
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