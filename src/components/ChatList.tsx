import { Star, MessageSquare, Calendar } from "lucide-react";

interface Chat {
  id: number;
  title: string;
  preview: string;
  date: string;
  replies: number;
  favorite: boolean;
}

interface ChatListProps {
  chats: Chat[];
}

const ChatList = ({ chats }: ChatListProps) => {
  return (
    <section className="space-y-4">
      {chats.map((chat) => (
        <div
          key={chat.id}
          className="p-4 bg-card rounded-lg border shadow-sm hover:shadow-md transition-shadow"
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
          <p className="text-sm text-muted-foreground mb-3">{chat.preview}</p>
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