import { useState } from "react";
import { ChatInput } from "./ChatInput";

interface MessageInputProps {
  onSend: (message: string) => void;
}

const MessageInput = ({ onSend }: MessageInputProps) => {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    setIsLoading(true);
    try {
      await onSend(input);
      setInput("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <ChatInput
      input={input}
      isLoading={isLoading}
      onInputChange={setInput}
      onSend={handleSend}
      onKeyPress={handleKeyPress}
    />
  );
};

export default MessageInput;