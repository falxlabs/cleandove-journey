import { useState } from "react";
import { Message } from "@/types/chat";
import { useChatOperations } from "./useChatOperations";
import { useCredits } from "./useCredits";
import { supabase } from "@/integrations/supabase/client";

export const useMessageOperations = (chatId: string | undefined) => {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { sendChatMessage } = useChatOperations();
  const { handleCredits } = useCredits();

  const sendMessage = async (messages: Message[], onSuccess: (content: string) => void) => {
    if (!input.trim()) return;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.error('No active session');
      return;
    }

    const creditsAvailable = await handleCredits();
    if (!creditsAvailable) return;

    setIsLoading(true);
    const newMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    };

    try {
      const content = await sendChatMessage([...messages, newMessage]);
      onSuccess(content);
      setInput("");
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