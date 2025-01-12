import { useState } from "react";
import { Message } from "@/types/chat";
import { useChatOperations } from "./useChatOperations";
import { useCredits } from "./useCredits";
import { supabase } from "@/integrations/supabase/client";

export const useMessageOperations = (chatId: string | undefined) => {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { handleCredits } = useCredits();

  const sendChatMessage = async (messages: Message[]): Promise<string> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No active session');

      const { data, error } = await supabase.functions.invoke('chat', {
        body: { messages },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (error) throw error;
      return data.content;
    } catch (error) {
      console.error('Error sending chat message:', error);
      throw error;
    }
  };

  const sendMessage = async (messages: Message[]): Promise<string | undefined> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.error('No active session');
      return;
    }

    // Only check credits when actually sending a message
    const creditsAvailable = await handleCredits();
    if (!creditsAvailable) return;

    setIsLoading(true);
    try {
      const content = await sendChatMessage(messages);
      setInput(""); // Clear input after successful send
      return content;
    } catch (error) {
      console.error('Error sending chat message:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const regenerateMessage = async (messageId: string) => {
    console.log("Regenerate message:", messageId);
  };

  return {
    input,
    setInput,
    isLoading,
    sendMessage,
    regenerateMessage,
  };
};