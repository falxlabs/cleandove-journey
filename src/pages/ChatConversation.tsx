import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ChatHeader } from "@/components/ChatHeader";
import { MessageList } from "@/components/MessageList";
import { ChatInput } from "@/components/ChatInput";
import { CreditAlert } from "@/components/chat/CreditAlert";
import { useChat } from "@/hooks/useChat";

const ChatConversation = () => {
  const location = useLocation();
  const {
    input,
    setInput,
    isLoading,
    isInitialLoading,
    messages,
    showCreditAlert,
    setShowCreditAlert,
    sendMessage,
    initializeChat,
    regenerateMessage,
    chatTitle
  } = useChat({
    initialTopic: location.state?.topic,
    context: location.state?.context,
    improvement: location.state?.improvement,
    chatId: location.state?.chatId,
    isExistingChat: location.state?.isExistingChat
  });

  useEffect(() => {
    initializeChat();
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background pb-0">
      <ChatHeader topic={location.state?.topic} title={chatTitle} />
      <MessageList 
        messages={messages} 
        isLoading={isLoading || isInitialLoading} 
        onRegenerate={regenerateMessage}
      />
      <ChatInput
        input={input}
        isLoading={isLoading}
        onInputChange={setInput}
        onSend={sendMessage}
        onKeyPress={handleKeyPress}
      />
      <CreditAlert open={showCreditAlert} onOpenChange={setShowCreditAlert} />
    </div>
  );
};

export default ChatConversation;