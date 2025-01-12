import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, Copy, Share2, RefreshCw } from "lucide-react";

interface MessageActionsProps {
  content: string;
  messageId: string;
  onCopy: (content: string) => void;
  onShare: (content: string) => void;
  onRegenerate?: (messageId: string) => void;
}

export const MessageActions = ({ 
  content, 
  messageId, 
  onCopy, 
  onShare, 
  onRegenerate 
}: MessageActionsProps) => {
  return (
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
        onClick={() => onCopy(content)}
      >
        <Copy className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8"
        onClick={() => onShare(content)}
      >
        <Share2 className="h-4 w-4" />
      </Button>
      {onRegenerate && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8"
          onClick={() => onRegenerate(messageId)}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};