import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/chat";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export const useChatHistory = () => {
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
      // Only create a new chat if there isn't an existing chatId
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

        // Set the chatId for future messages in this conversation
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

  const saveMessages = async (
    newChatId: string,
    messages: Message[],
    input: string,
    assistantResponse: string
  ) => {
    try {
      const messagesToInsert = [];

      if (messages && messages.length > 0) {
        messagesToInsert.push({
          chat_id: newChatId,
          content: messages[0].content,
          sender: "assistant",
          sequence_number: 1,
        });
      }

      messagesToInsert.push({
        chat_id: newChatId,
        content: input,
        sender: "user",
        sequence_number: messages.length > 0 ? 2 : 1,
      });

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

      queryClient.invalidateQueries({ queryKey: ["chat-history"] });
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
    existingChatId: string,
    input: string,
    assistantResponse: string,
    messageCount: number
  ) => {
    try {
      const messagesToInsert = [
        {
          chat_id: existingChatId,
          content: input,
          sender: "user",
          sequence_number: messageCount + 1,
        },
        {
          chat_id: existingChatId,
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
        .eq("id", existingChatId);

      if (chatError) {
        console.error("Error updating chat history:", chatError);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update chat history. Please try again.",
        });
      }

      queryClient.invalidateQueries({ queryKey: ["chat-history"] });
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