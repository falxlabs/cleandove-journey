import { format } from "date-fns";
import { MessageActions } from "./MessageActions";
import { Message } from "@/types/chat";

interface MessageBubbleProps {
  message: Message;
  onCopy: (content: string) => void;
  onShare: (content: string) => void;
  onRegenerate?: (messageId: string) => void;
}

export const MessageBubble = ({ 
  message, 
  onCopy, 
  onShare, 
  onRegenerate 
}: MessageBubbleProps) => {
  return (
    <div
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
        {message.sender === "user" && (
          <div className="flex justify-end mt-1">
            <span className="text-xs text-muted-foreground">
              {format(message.timestamp, "HH:mm")}
            </span>
          </div>
        )}
        {message.sender === "assistant" && (
          <div className="flex items-center justify-between mt-2">
            {!message.isInitialMessage && (
              <MessageActions
                content={message.content}
                messageId={message.id}
                onCopy={onCopy}
                onShare={onShare}
                onRegenerate={onRegenerate}
              />
            )}
            <span className="text-xs text-muted-foreground ml-2">
              {format(message.timestamp, "HH:mm")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};