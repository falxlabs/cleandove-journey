import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/chat";
import { useNavigate, useLocation } from "react-router-dom";

export const useChatOperations = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const handleDelete = async (chatId: string) => {
    try {
      const { error } = await supabase
        .from('chat_histories')
        .delete()
        .eq('id', chatId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['chat-history'] });
      
      toast({
        description: "Chat deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting chat:', error);
      toast({
        variant: "destructive",
        description: "Failed to delete chat",
      });
    }
  };

  const handleFavorite = async (chatId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('chat_histories')
        .update({ favorite: !currentStatus })
        .eq('id', chatId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['chat-history'] });
    } catch (error) {
      console.error('Error updating favorite status:', error);
      toast({
        variant: "destructive",
        description: "Failed to update favorite status",
      });
    }
  };

  const handleChatClick = (chatId: string, title: string) => {
    navigate(`/conversation`, { 
      state: { 
        chatId,
        topic: title,
        isExistingChat: true,
        from: location.pathname
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