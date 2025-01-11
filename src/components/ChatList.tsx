import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { SwipeableItem } from "./chat/SwipeableItem";
import { ChatItem } from "./chat/ChatItem";

interface Chat {
  id: string;
  title: string;
  preview: string;
  date: string;
  replies: number;
  favorite: boolean;
}

interface ChatListProps {
  chats: Chat[];
  isLoading?: boolean;
}

const ChatList = ({ chats, isLoading = false }: ChatListProps) => {
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
      
      toast({
        description: `Chat ${!currentStatus ? 'added to' : 'removed from'} favorites`,
      });
    } catch (error) {
      console.error('Error updating favorite status:', error);
      toast({
        variant: "destructive",
        description: "Failed to update favorite status",
      });
    }
  };

  const handleChatClick = (chat: Chat) => {
    navigate(`/conversation`, { 
      state: { 
        chatId: chat.id,
        topic: chat.title,
        isExistingChat: true,
        from: location.pathname
      } 
    });
  };

  if (isLoading) {
    return (
      <section className="space-y-4">
        {[1, 2, 3].map((index) => (
          <div
            key={index}
            className="p-4 bg-card rounded-lg border shadow-sm"
          >
            <div className="flex justify-between items-start mb-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-6 w-6 rounded-full" />
            </div>
            <Skeleton className="h-4 w-full mb-3" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        ))}
      </section>
    );
  }

  return (
    <section className="space-y-4">
      {chats.map((chat) => (
        <SwipeableItem
          key={chat.id}
          id={chat.id}
          onSwipeComplete={() => handleDelete(chat.id)}
        >
          <ChatItem 
            {...chat} 
            onFavorite={() => handleFavorite(chat.id, chat.favorite)}
            onClick={() => handleChatClick(chat)}
          />
        </SwipeableItem>
      ))}
    </section>
  );
};

export default ChatList;