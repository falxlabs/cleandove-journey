import { Message } from "@/types/chat";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, Copy, Share2, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  onRegenerate?: (messageId: string) => void;
}

export const MessageList = ({ messages, isLoading, onRegenerate }: MessageListProps) => {
  const { toast } = useToast();

  const handleCopy = async (content: string) => {
    await navigator.clipboard.writeText(content);
    toast({
      description: "Message copied to clipboard",
    });
  };

  const handleShare = async (content: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          text: content,
        });
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          toast({
            variant: "destructive",
            description: "Failed to share message",
          });
        }
      }
    } else {
      await handleCopy(content);
    }
  };

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
            <div className="flex justify-end mt-1">
              <span className="text-xs text-muted-foreground">
                {format(message.timestamp, "HH:mm")}
              </span>
            </div>
            {message.sender === "assistant" && (
              <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ThumbsUp className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ThumbsDown className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => handleCopy(message.content)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => handleShare(message.content)}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
                {onRegenerate && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => onRegenerate(message.id)}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                )}
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