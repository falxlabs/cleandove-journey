import { Chat } from "@/types/chat-list";
import { SwipeableItem } from "./SwipeableItem";
import { ChatItem } from "./ChatItem";
import { useChatOperations } from "@/hooks/useChatOperations";

interface FilteredChatListProps {
  chats: Chat[];
}

export const FilteredChatList = ({ chats }: FilteredChatListProps) => {
  const { handleDelete, handleFavorite, handleChatClick } = useChatOperations();

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
            onClick={() => handleChatClick(chat.id, chat.title)}
          />
        </SwipeableItem>
      ))}
    </section>
  );
};