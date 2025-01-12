import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChatHeader } from "@/components/ChatHeader";
import { MessageList } from "@/components/MessageList";
import { ChatInput } from "@/components/ChatInput";
import { CreditAlert } from "@/components/chat/CreditAlert";
import { useChat } from "@/hooks/useChat";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ChatConversation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
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
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (!session) {
          navigate('/auth');
          return;
        }
        
        await initializeChat();
      } catch (error) {
        console.error('Authentication error:', error);
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "Please try logging in again.",
        });
        navigate('/auth');
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
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