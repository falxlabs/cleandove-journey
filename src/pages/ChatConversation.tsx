import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChatHeader } from "@/components/ChatHeader";
import { MessageList } from "@/components/MessageList";
import { ChatInput } from "@/components/ChatInput";
import { CreditAlert } from "@/components/chat/CreditAlert";
import { useChat } from "@/hooks/useChat";
import { supabase } from "@/integrations/supabase/client";

const ChatConversation = () => {
  const location = useLocation();
  const navigate = useNavigate();
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
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }
      initializeChat();
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

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