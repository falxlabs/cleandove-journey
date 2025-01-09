import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import TopicCarousel from "@/components/TopicCarousel";
import { useTopicSelection } from "@/hooks/useTopicSelection";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const Chat = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { selectedTopic, setSelectedTopic, temptations, therapyTopics } = useTopicSelection();

  const handleStartChat = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data: chat, error } = await supabase
        .from("chat_histories")
        .insert([
          {
            title: selectedTopic || "New Chat",
            user_id: user.id,
            preview: "Started a new conversation",
          },
        ])
        .select()
        .single();

      if (error) throw error;

      navigate(`/chat/conversation/${chat.id}`, {
        state: {
          topic: selectedTopic,
          mascot: "🕊️",
        },
      });
    } catch (error) {
      console.error("Error starting chat:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to start new chat. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen pb-20 animate-fade-in">
      <PageHeader
        title="Chat"
        emoji="🕊️"
        description="Choose a topic to begin"
      />

      <section className="px-6 space-y-6">
        <Button
          onClick={handleStartChat}
          className="w-full p-6 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <div className="flex justify-between items-center w-full">
            <span className="font-medium">Start New Chat</span>
            <ChevronRight className="h-5 w-5" />
          </div>
        </Button>

        <TopicCarousel
          title="I'm struggling with..."
          topics={temptations}
          onTopicSelect={setSelectedTopic}
        />

        <TopicCarousel
          title="Ask about..."
          topics={therapyTopics}
          onTopicSelect={setSelectedTopic}
        />
      </section>
    </div>
  );
};

export default Chat;