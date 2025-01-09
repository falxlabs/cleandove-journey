import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import PageHeader from "@/components/PageHeader";
import { useTopicSelection } from "@/hooks/useTopicSelection";
import StartChatButton from "@/components/chat/StartChatButton";
import ChatTopicSection from "@/components/chat/ChatTopicSection";
import { supabase } from "@/integrations/supabase/client";

const Chat = () => {
  const navigate = useNavigate();
  const { selectedTopic, setSelectedTopic, temptations, therapyTopics } = useTopicSelection();

  const { isLoading: isUserLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });

  const handleStartChat = () => {
    navigate("/chat/conversation", {
      state: {
        topic: selectedTopic,
        mascot: "🕊️",
      },
    });
  };

  return (
    <div className="min-h-screen pb-20 animate-fade-in">
      <PageHeader
        title="Chat"
        emoji="🕊️"
        description="Choose a topic to begin"
      />

      <section className="px-6 space-y-6">
        <StartChatButton onClick={handleStartChat} />

        <ChatTopicSection
          title="I'm struggling with..."
          topics={temptations}
          onTopicSelect={setSelectedTopic}
          isLoading={isUserLoading}
        />

        <ChatTopicSection
          title="Ask about..."
          topics={therapyTopics}
          onTopicSelect={setSelectedTopic}
          isLoading={isUserLoading}
        />
      </section>
    </div>
  );
};

export default Chat;