import { Star, MessageSquare, Calendar, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Drawer } from "vaul";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

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
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
  };

  const handleDelete = async (chatId: string) => {
    try {
      setDeletingId(chatId);
      const { error } = await supabase
        .from('chat_histories')
        .delete()
        .eq('id', chatId);

      if (error) throw error;

      toast({
        description: "Chat deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting chat:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete chat. Please try again.",
      });
    } finally {
      setDeletingId(null);
    }
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
        <Drawer.Root key={chat.id}>
          <Drawer.Trigger asChild>
            <div
              className="p-4 bg-card rounded-lg border shadow-sm hover:shadow-md transition-shadow animate-fade-in relative overflow-hidden group"
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

              {/* Delete indicator that appears on swipe */}
              <div className="absolute inset-y-0 right-0 w-16 bg-red-500 flex items-center justify-center transform translate-x-full group-hover:translate-x-0 transition-transform">
                <Trash2 className="h-6 w-6 text-white" />
              </div>
            </div>
          </Drawer.Trigger>
          <Drawer.Portal>
            <Drawer.Content className="fixed bottom-0 left-0 right-0 mt-24 rounded-t-[10px] h-[20%] flex flex-col bg-background">
              <div className="p-4 flex-1 flex flex-col items-center justify-center">
                <h3 className="font-semibold mb-4">Delete Chat</h3>
                <p className="text-muted-foreground mb-6">Are you sure you want to delete this chat?</p>
                <div className="flex gap-4">
                  <Drawer.Close className="px-4 py-2 rounded-md border hover:bg-muted">
                    Cancel
                  </Drawer.Close>
                  <button
                    onClick={() => handleDelete(chat.id)}
                    disabled={deletingId === chat.id}
                    className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
                  >
                    {deletingId === chat.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </Drawer.Content>
            <Drawer.Overlay className="fixed inset-0 bg-black/40" />
          </Drawer.Portal>
        </Drawer.Root>
      ))}
    </section>
  );
};

export default ChatList;