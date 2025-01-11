import { Skeleton } from "@/components/ui/skeleton";
import { ChatListProps } from "@/types/chat-list";
import { FilteredChatList } from "./chat/FilteredChatList";

const ChatList = ({ chats, isLoading = false }: ChatListProps) => {
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

  return <FilteredChatList chats={chats} />;
};

export default ChatList;