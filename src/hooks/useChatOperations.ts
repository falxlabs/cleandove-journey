import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/chat";
import { useToast } from "@/hooks/use-toast";

export const useChatOperations = () => {
  const { toast } = useToast();

  const sendChatMessage = async (messages: Message[]) => {
    try {
      const { data, error } = await supabase.functions.invoke('chat', {
        body: { messages }
      });

      if (error) throw error;
      return data.content;
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message. Please try again.",
      });
      throw error;
    }
  };

  return {
    sendChatMessage,
  };
};