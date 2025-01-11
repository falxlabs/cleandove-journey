import { Star, MessageSquare, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

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
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
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
          className="p-4 bg-card rounded-lg border shadow-sm hover:shadow-md transition-shadow animate-fade-in"
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
            {truncateText(chat.preview, 70)}
          </p>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-1" />
            <span className="mr-4">{chat.date}</span>
            <MessageSquare className="h-4 w-4 mr-1" />
            <span>{chat.replies} replies</span>
          </div>
        </div>
      ))}
    </section>
  );
};

export default ChatList;