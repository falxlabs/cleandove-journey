import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Message } from "@/types/chat";
import { ChatHeader } from "@/components/ChatHeader";
import { MessageList } from "@/components/MessageList";
import { ChatInput } from "@/components/ChatInput";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { checkCredits, deductCredit } from "@/utils/credits";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const ChatConversation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showCreditAlert, setShowCreditAlert] = useState(false);

  useEffect(() => {
    const createChatHistory = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "You must be logged in to chat.",
          });
          return;
        }

        const { data: chatHistory, error: chatError } = await supabase
          .from("chat_histories")
          .insert({
            title: location.state?.topic || "New Chat",
            preview: "Hello! How can I help you today?",
            user_id: user.id,
          })
          .select()
          .single();

        if (chatError) {
          console.error("Chat history creation error:", chatError);
          throw chatError;
        }

        setChatId(chatHistory.id);

        const { error: messageError } = await supabase
          .from("messages")
          .insert({
            chat_id: chatHistory.id,
            content: "Hello! How can I help you today?",
            sender: "assistant",
            sequence_number: 1,
          });

        if (messageError) {
          console.error("Initial message creation error:", messageError);
          throw messageError;
        }

        setMessages([
          {
            id: "1",
            content: "Hello! How can I help you today?",
            sender: "assistant",
            timestamp: new Date(),
          },
        ]);
      } catch (error) {
        console.error("Error creating chat:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to start new chat. Please try again.",
        });
      } finally {
        setIsInitialLoading(false);
      }
    };

    createChatHistory();
  }, [location.state?.topic, toast]);

  const handleSend = async () => {
    if (!input.trim() || !chatId) return;

    try {
      // Check credits before proceeding
      const hasCredits = await checkCredits();
      if (!hasCredits) {
        setShowCreditAlert(true);
        return;
      }

      setIsLoading(true);
      const newMessage: Message = {
        id: Date.now().toString(),
        content: input,
        sender: "user",
        timestamp: new Date(),
      };

      // Add user message to UI immediately
      setMessages((prev) => [...prev, newMessage]);
      setInput("");

      // Insert user message to database
      const { error: messageError } = await supabase
        .from("messages")
        .insert({
          chat_id: chatId,
          content: input,
          sender: "user",
          sequence_number: messages.length + 1,
        });

      if (messageError) {
        console.error("Error inserting user message:", messageError);
        throw new Error("Failed to save your message");
      }

      // Deduct credit before AI call
      const creditDeducted = await deductCredit();
      if (!creditDeducted) {
        throw new Error("Failed to process credit deduction");
      }

      // Call OpenAI via Edge Function
      const { data, error: aiError } = await supabase.functions.invoke('chat', {
        body: { messages: [...messages, newMessage] }
      });

      if (aiError) {
        console.error("AI response error:", aiError);
        throw new Error("Failed to get AI response");
      }

      if (!data?.content) {
        throw new Error("Invalid AI response format");
      }

      const assistantResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: data.content,
        sender: "assistant",
        timestamp: new Date(),
      };

      // Insert assistant response
      const { error: assistantMessageError } = await supabase
        .from("messages")
        .insert({
          chat_id: chatId,
          content: data.content,
          sender: "assistant",
          sequence_number: messages.length + 2,
        });

      if (assistantMessageError) {
        console.error("Error inserting AI response:", assistantMessageError);
        throw new Error("Failed to save AI response");
      }

      // Update chat history preview
      const { error: updateError } = await supabase
        .from("chat_histories")
        .update({
          preview: data.content,
          reply_count: messages.length + 2,
        })
        .eq("id", chatId);

      if (updateError) {
        console.error("Error updating chat history:", updateError);
        throw new Error("Failed to update chat history");
      }

      setMessages((prev) => [...prev, assistantResponse]);
    } catch (error) {
      console.error('Error in handleSend:', error);
      // Rollback the optimistic UI update
      setMessages((prev) => prev.slice(0, -1));
      setInput(input); // Restore the input
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to send message. Please try again.",
      });
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

      <AlertDialog open={showCreditAlert} onOpenChange={setShowCreditAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Out of Credits</AlertDialogTitle>
            <AlertDialogDescription>
              You've reached your credit limit. Each AI response costs 1 credit, and you're currently out of credits.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowCreditAlert(false)}>
              Understood
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ChatConversation;