import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/chat";
import { useToast } from "@/hooks/use-toast";

export const useChatHistory = () => {
  const [chatId, setChatId] = useState<string | null>(null);
  const { toast } = useToast();

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
      const { data: chatHistory, error: chatError } = await supabase
        .from("chat_histories")
        .insert({
          title: "New Chat",
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

      return chatHistory.id;
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

  const saveMessages = async (
    newChatId: string,
    messages: Message[],
    input: string,
    assistantResponse: string
  ) => {
    try {
      const messagesToInsert = [];

      // Add initial assistant message if it exists
      if (messages && messages.length > 0) {
        messagesToInsert.push({
          chat_id: newChatId,
          content: messages[0].content,
          sender: "assistant",
          sequence_number: 1,
        });
      }

      // Add user message
      messagesToInsert.push({
        chat_id: newChatId,
        content: input,
        sender: "user",
        sequence_number: messages.length > 0 ? 2 : 1,
      });

      // Add assistant response
      messagesToInsert.push({
        chat_id: newChatId,
        content: assistantResponse,
        sender: "assistant",
        sequence_number: messages.length > 0 ? 3 : 2,
      });

      const { error: messagesError } = await supabase
        .from("messages")
        .insert(messagesToInsert);

      if (messagesError) {
        console.error("Error saving messages:", messagesError);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to save messages. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error in saveMessages:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred while saving messages.",
      });
    }
  };

  const updateExistingChat = async (
    chatId: string,
    input: string,
    assistantResponse: string,
    messageCount: number
  ) => {
    try {
      const messagesToInsert = [
        {
          chat_id: chatId,
          content: input,
          sender: "user",
          sequence_number: messageCount + 1,
        },
        {
          chat_id: chatId,
          content: assistantResponse,
          sender: "assistant",
          sequence_number: messageCount + 2,
        },
      ];

      const { error: messagesError } = await supabase
        .from("messages")
        .insert(messagesToInsert);

      if (messagesError) {
        console.error("Error updating messages:", messagesError);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update chat. Please try again.",
        });
        return;
      }

      const { error: chatError } = await supabase
        .from("chat_histories")
        .update({
          preview: assistantResponse,
          reply_count: messageCount + 2,
        })
        .eq("id", chatId);

      if (chatError) {
        console.error("Error updating chat history:", chatError);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update chat history. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error in updateExistingChat:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred while updating the chat.",
      });
    }
  };

  return {
    chatId,
    setChatId,
    createChatHistory,
    saveMessages,
    updateExistingChat,
  };
};