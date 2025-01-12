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

  return {
    saveMessages,
  };
};