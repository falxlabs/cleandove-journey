import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useChatOperations = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDelete = async (chatId: string) => {
    try {
      const { error } = await supabase
        .from('chat_histories')
        .delete()
        .eq('id', chatId);

      if (error) throw error;

      toast({
        title: "Chat deleted",
        description: "The chat has been successfully deleted.",
      });
    } catch (error) {
      console.error('Error deleting chat:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete the chat. Please try again.",
      });
    }
  };

  const handleFavorite = async (chatId: string, currentFavorite: boolean) => {
    try {
      const { error } = await supabase
        .from('chat_histories')
        .update({ favorite: !currentFavorite })
        .eq('id', chatId);

      if (error) throw error;

      toast({
        title: currentFavorite ? "Removed from favorites" : "Added to favorites",
        description: currentFavorite 
          ? "The chat has been removed from your favorites."
          : "The chat has been added to your favorites.",
      });
    } catch (error) {
      console.error('Error updating favorite status:', error);
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

  return {
    handleDelete,
    handleFavorite,
    handleChatClick
  };
};