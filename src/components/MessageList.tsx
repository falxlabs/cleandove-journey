import { Message } from "@/types/chat";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, Copy, Share2, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

export const MessageList = ({ messages, isLoading }: MessageListProps) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${
            message.sender === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`max-w-[80%] rounded-lg p-3 ${
              message.sender === "user"
                ? "bg-primary text-primary-foreground ml-auto"
                : "bg-muted ml-2"
            }`}
          >
            <p className="text-sm">{message.content}</p>
            {message.sender === "assistant" && (
              <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ThumbsUp className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ThumbsDown className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      ))}
      {isLoading && (
        <div className="flex justify-start">
          <Skeleton className="h-20 w-3/4" />
        </div>
      )}
    </div>
  );
};