import { Star, MessageSquare, Calendar, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useState, useRef, TouchEvent, MouseEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

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
  const queryClient = useQueryClient();
  const [swipingId, setSwipingId] = useState<string | null>(null);
  const touchStartX = useRef<number>(0);
  const currentOffset = useRef<number>(0);
  const isSwiping = useRef(false);
  const isDragging = useRef(false);

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
  };

  const handleTouchStart = (e: TouchEvent, chatId: string) => {
    touchStartX.current = e.touches[0].clientX;
    setSwipingId(chatId);
    isSwiping.current = false;
  };

  const handleMouseDown = (e: MouseEvent, chatId: string) => {
    touchStartX.current = e.clientX;
    setSwipingId(chatId);
    isSwiping.current = false;
    isDragging.current = true;
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!swipingId) return;
    const touchX = e.touches[0].clientX;
    const diff = touchStartX.current - touchX;
    if (Math.abs(diff) > 5) {
      isSwiping.current = true;
    }
    currentOffset.current = Math.max(0, Math.min(diff, 100));
    
    const element = document.getElementById(`chat-${swipingId}`);
    if (element) {
      element.style.transform = `translateX(-${currentOffset.current}px)`;
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!swipingId || !isDragging.current) return;
    const touchX = e.clientX;
    const diff = touchStartX.current - touchX;
    if (Math.abs(diff) > 5) {
      isSwiping.current = true;
    }
    currentOffset.current = Math.max(0, Math.min(diff, 100));
    
    const element = document.getElementById(`chat-${swipingId}`);
    if (element) {
      element.style.transform = `translateX(-${currentOffset.current}px)`;
    }
  };

  const handleDragEnd = async () => {
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
      
      // If it wasn't a significant swipe, treat it as a click and navigate
      if (!isSwiping.current) {
        const chat = chats.find(chat => chat.id === swipingId);
        if (chat) {
          navigate(`/conversation`, { 
            state: { 
              chatId: swipingId,
              topic: chat.title,
              isExistingChat: true,
              from: location.pathname
            } 
          });
        }
      }
    }

    currentOffset.current = 0;
    setSwipingId(null);
    isSwiping.current = false;
    isDragging.current = false;
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
    <section 
      className="space-y-4"
      onMouseMove={handleMouseMove}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
    >
      {chats.map((chat) => (
        <div
          key={chat.id}
          id={`chat-${chat.id}`}
          className="relative p-4 bg-card rounded-lg border shadow-sm hover:shadow-md transition-all touch-pan-y cursor-pointer select-none overflow-hidden"
          onTouchStart={(e) => handleTouchStart(e, chat.id)}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleDragEnd}
          onMouseDown={(e) => handleMouseDown(e, chat.id)}
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
            className="absolute inset-0 bg-destructive flex items-center justify-end"
            style={{ 
              transform: `translateX(${100 - (currentOffset.current)}%)`,
              transition: swipingId === chat.id ? 'none' : 'transform 0.2s ease-out'
            }}
          >
            <div className="px-4">
              <Trash2 className="text-white h-6 w-6" />
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default ChatList;
