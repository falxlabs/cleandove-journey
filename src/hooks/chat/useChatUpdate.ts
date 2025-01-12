import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export const useChatUpdate = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
    updateExistingChat,
  };
};