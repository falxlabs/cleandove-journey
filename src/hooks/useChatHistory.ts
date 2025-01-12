import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/chat";

export const useChatHistory = () => {
  const [chatId, setChatId] = useState<string | null>(null);

  const createChatHistory = async (userMessage: string, assistantMessage: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: chatHistory, error: chatError } = await supabase
      .from("chat_histories")
      .insert({
        title: "New Chat",
        preview: assistantMessage,
        user_id: user.id,
      })
      .select()
      .single();

    if (chatError) throw chatError;
    return chatHistory.id;
  };

  const saveMessages = async (
    newChatId: string,
    messages: Message[],
    input: string,
    assistantResponse: string
  ) => {
    // Check if we have an initial assistant message
    if (messages && messages.length > 0) {
      // Insert initial assistant message
      await supabase
        .from("messages")
        .insert({
          chat_id: newChatId,
          content: messages[0].content,
          sender: "assistant",
          sequence_number: 1,
        });
    }

    // Insert user message
    await supabase
      .from("messages")
      .insert({
        chat_id: newChatId,
        content: input,
        sender: "user",
        sequence_number: messages.length > 0 ? 2 : 1,
      });

    // Insert assistant response
    await supabase
      .from("messages")
      .insert({
        chat_id: newChatId,
        content: assistantResponse,
        sender: "assistant",
        sequence_number: messages.length > 0 ? 3 : 2,
      });
  };

  const updateExistingChat = async (
    chatId: string,
    input: string,
    assistantResponse: string,
    messageCount: number
  ) => {
    await supabase
      .from("messages")
      .insert({
        chat_id: chatId,
        content: input,
        sender: "user",
        sequence_number: messageCount + 1,
      });

    await supabase
      .from("messages")
      .insert({
        chat_id: chatId,
        content: assistantResponse,
        sender: "assistant",
        sequence_number: messageCount + 2,
      });

    await supabase
      .from("chat_histories")
      .update({
        preview: assistantResponse,
        reply_count: messageCount + 2,
      })
      .eq("id", chatId);
  };

  return {
    chatId,
    setChatId,
    createChatHistory,
    saveMessages,
    updateExistingChat,
  };
};