import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

export const ChatInput = ({
  input,
  isLoading,
  onInputChange,
  onSend,
  onKeyPress,
}: ChatInputProps) => {
  return (
    <div className="p-4 border-t mt-auto">
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyPress={onKeyPress}
          placeholder="Type a message..."
          className="flex-1"
          disabled={isLoading}
        />
        <Button onClick={onSend} disabled={!input.trim() || isLoading}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};