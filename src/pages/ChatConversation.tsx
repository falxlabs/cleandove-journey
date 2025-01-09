import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Message } from "@/types/chat";
import { ChatHeader } from "@/components/ChatHeader";
import { MessageList } from "@/components/MessageList";
import { ChatInput } from "@/components/ChatInput";

const ChatConversation = () => {
  const location = useLocation();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! How can I help you today?",
      sender: "assistant",
      timestamp: new Date(),
    },
  ]);

  // Simulate initial loading
  setTimeout(() => {
    setIsInitialLoading(false);
  }, 1000);

  const handleSend = () => {
    if (!input.trim()) return;

    setIsLoading(true);
    const newMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);

    // Simulate Grace's response
    setTimeout(() => {
      const graceResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: `I understand you're ${
          location.state?.topic ? `dealing with ${location.state.topic}` : "seeking guidance"
        }. Let me help you with that. What specific challenges are you facing?`,
        sender: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, graceResponse]);
      setIsLoading(false);
    }, 1000);

    setInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background pb-0">
      <ChatHeader topic={location.state?.topic} />
      <MessageList messages={messages} isLoading={isLoading || isInitialLoading} />
      <ChatInput
        input={input}
        isLoading={isLoading}
        onInputChange={setInput}
        onSend={handleSend}
        onKeyPress={handleKeyPress}
      />
    </div>
  );
};

export default ChatConversation;