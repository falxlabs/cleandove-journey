import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/chat";

export const useChatTitle = (initialTopic?: string) => {
  const [chatTitle, setChatTitle] = useState<string>(initialTopic || "New Chat");

  const generateTitle = async (messages: Message[], chatId: string | null) => {
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

  return {
    chatTitle,
    setChatTitle,
    generateTitle,
  };
};