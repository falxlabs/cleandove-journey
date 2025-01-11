import { Star, MessageSquare, Calendar, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useState, useRef, TouchEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();
  const [swipingId, setSwipingId] = useState<string | null>(null);
  const touchStartX = useRef<number>(0);
  const currentOffset = useRef<number>(0);

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
  };

  const handleTouchStart = (e: TouchEvent, chatId: string) => {
    touchStartX.current = e.touches[0].clientX;
    setSwipingId(chatId);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!swipingId) return;
    const touchX = e.touches[0].clientX;
    const diff = touchStartX.current - touchX;
    currentOffset.current = Math.max(0, Math.min(diff, 100));
    
    const element = document.getElementById(`chat-${swipingId}`);
    if (element) {
      element.style.transform = `translateX(-${currentOffset.current}px)`;
    }
  };

  const handleTouchEnd = async () => {
    if (!swipingId) return;
    
    const element = document.getElementById(`chat-${swipingId}`);
    if (!element) return;

    if (currentOffset.current > 50) {
      // Delete the chat
      try {
        const { error } = await supabase
          .from('chat_histories')
          .delete()
          .eq('id', swipingId);

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
        // Reset position if deletion fails
        element.style.transform = 'translateX(0)';
      }
    } else {
      // Reset position if not swiped far enough
      element.style.transform = 'translateX(0)';
    }

    currentOffset.current = 0;
    setSwipingId(null);
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
        <div
          key={chat.id}
          id={`chat-${chat.id}`}
          className="relative p-4 bg-card rounded-lg border shadow-sm hover:shadow-md transition-all touch-pan-y"
          onTouchStart={(e) => handleTouchStart(e, chat.id)}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium">{chat.title}</h3>
            <button
              className={`p-1 rounded-full transition-colors ${
                chat.favorite
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              <Star className="h-5 w-5" />
            </button>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            {truncateText(chat.preview, 150)}
          </p>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-1" />
            <span className="mr-4">{chat.date}</span>
            <MessageSquare className="h-4 w-4 mr-1" />
            <span>{chat.replies} replies</span>
          </div>
          <div 
            className="absolute right-0 top-0 bottom-0 flex items-center justify-center bg-destructive w-[100px] transition-opacity"
            style={{ 
              opacity: swipingId === chat.id ? Math.min(currentOffset.current / 50, 1) : 0 
            }}
          >
            <Trash2 className="text-white h-6 w-6" />
          </div>
        </div>
      ))}
    </section>
  );
};

export default ChatList;