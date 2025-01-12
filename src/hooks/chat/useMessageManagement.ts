import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/chat";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export const useMessageManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const saveMessages = async (
    newChatId: string,
    messages: Message[],
    input: string,
    assistantResponse: string
  ) => {
    try {
      const messagesToInsert = [
        {
          chat_id: newChatId,
          content: input,
          sender: "user",
          sequence_number: 1,
        },
        {
          chat_id: newChatId,
          content: assistantResponse,
          sender: "assistant",
          sequence_number: 2,
        }
      ];

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

  return {
    saveMessages,
  };
};