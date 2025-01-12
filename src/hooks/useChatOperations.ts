import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Message } from "@/types/chat";

export const useChatOperations = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDelete = async (chatId: string) => {
    try {
      const { error } = await supabase
        .from("chat_histories")
        .delete()
        .eq("id", chatId);

      if (error) throw error;

      // Invalidate and refetch chat history
      queryClient.invalidateQueries({ queryKey: ["chat-history"] });

      toast({
        title: "Chat deleted",
        description: "The chat has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting chat:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete chat. Please try again.",
      });
    }
  };

  const handleFavorite = async (chatId: string, currentFavorite: boolean) => {
    try {
      const { error } = await supabase
        .from("chat_histories")
        .update({ favorite: !currentFavorite })
        .eq("id", chatId);

      if (error) throw error;

      // Invalidate and refetch chat history
      queryClient.invalidateQueries({ queryKey: ["chat-history"] });

      toast({
        title: currentFavorite ? "Removed from favorites" : "Added to favorites",
        description: currentFavorite
          ? "The chat has been removed from your favorites."
          : "The chat has been added to your favorites.",
      });
    } catch (error) {
      console.error("Error updating favorite status:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update favorite status. Please try again.",
      });
    }
  };

  const handleChatClick = (chatId: string, title: string) => {
    navigate("/conversation", { 
      state: { 
        chatId,
        title,
        isExistingChat: true
      } 
    });
  };

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

  return {
    handleDelete,
    handleFavorite,
    handleChatClick,
    sendChatMessage,
  };
};