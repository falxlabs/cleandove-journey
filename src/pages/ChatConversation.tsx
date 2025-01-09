import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import MessageList from "@/components/MessageList";
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
      const { data: message, error } = await supabase
        .from("messages")
        .insert([{ chat_id: chatId, content, sender: "user" }])
        .single();

      if (error) throw error;

      setMessages((prev) => [...prev, message]);

      // After receiving AI response
      const aiResponse = await sendToAI(messages);
      if (aiResponse) {
        await addMessage(aiResponse, 'assistant');
        await updateRepliesCount(chatId);  // Update reply count after AI response
      }

    } catch (error) {
      console.error('Error sending message:', error);
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
