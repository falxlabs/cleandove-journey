import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export const useChatCreation = () => {
  const [chatId, setChatId] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const generateInitialTitle = (message: string) => {
    const cleanedMessage = message.replace(/[^\w\s]/gi, '').trim();
    return cleanedMessage.length > 50 
      ? `${cleanedMessage.substring(0, 47)}...` 
      : cleanedMessage;
  };

  const createChatHistory = async (userMessage: string, assistantMessage: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "Please sign in to save chats.",
      });
      return null;
    }

    try {
      if (!chatId) {
        const initialTitle = generateInitialTitle(userMessage);
        const { data: chatHistory, error: chatError } = await supabase
          .from("chat_histories")
          .insert({
            title: initialTitle,
            preview: assistantMessage,
            user_id: user.id,
            reply_count: 0
          })
          .select()
          .single();

        if (chatError) {
          console.error("Error creating chat history:", chatError);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to create new chat. Please try again.",
          });
          return null;
        }

        setChatId(chatHistory.id);
        queryClient.invalidateQueries({ queryKey: ["chat-history"] });
        return chatHistory.id;
      }

      return chatId;
    } catch (error) {
      console.error("Error in createChatHistory:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      });
      return null;
    }
  };

  return {
    chatId,
    setChatId,
    createChatHistory,
  };
};