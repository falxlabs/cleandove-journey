import { Message } from "@/types/chat";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { MessageBubble } from "./chat/MessageBubble";

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

  // Sort messages by timestamp to ensure correct order
  const sortedMessages = [...messages].sort(
    (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
  );

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {sortedMessages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          onCopy={handleCopy}
          onShare={handleShare}
          onRegenerate={onRegenerate}
        />
      ))}
      {isLoading && (
        <div className="flex justify-start">
          <Skeleton className="h-20 w-3/4" />
        </div>
      )}
    </div>
  );
};