import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { MessageList } from "@/components/MessageList";
import MessageInput from "@/components/MessageInput";
import { updateRepliesCount } from "@/utils/credits";

const ChatConversation = () => {
  const { chatId } = useParams();
  const { toast } = useToast();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("chat_id", chatId)
        .order("created_at", { ascending: true });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load messages.",
        });
        setLoading(false);
        return;
      }

      setMessages(data);
      setLoading(false);
    };

    fetchMessages();
  }, [chatId, toast]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    try {
      // Get the current highest sequence number for this chat
      const { data: lastMessage } = await supabase
        .from("messages")
        .select("sequence_number")
        .eq("chat_id", chatId)
        .order("sequence_number", { ascending: false })
        .limit(1)
        .single();

      const nextSequenceNumber = (lastMessage?.sequence_number || 0) + 1;

      // Insert user message
      const { data: message, error } = await supabase
        .from("messages")
        .insert([
          {
            chat_id: chatId,
            content,
            sender: "user",
            sequence_number: nextSequenceNumber,
          },
        ])
        .single();

      if (error) throw error;

      setMessages((prev) => [...prev, message]);

      // Insert AI response
      const nextAISequenceNumber = nextSequenceNumber + 1;
      const { data: aiMessage, error: aiError } = await supabase
        .from("messages")
        .insert([
          {
            chat_id: chatId,
            content: "AI response placeholder", // Replace with actual AI response
            sender: "assistant",
            sequence_number: nextAISequenceNumber,
          },
        ])
        .single();

      if (aiError) throw aiError;

      setMessages((prev) => [...prev, aiMessage]);
      await updateRepliesCount(chatId);

    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <MessageList messages={messages} loading={loading} />
      <MessageInput onSend={handleSendMessage} />
    </div>
  );
};

export default ChatConversation;