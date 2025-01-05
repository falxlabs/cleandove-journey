import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import TopicCarousel from "@/components/TopicCarousel";
import { useTopicSelection } from "@/hooks/useTopicSelection";

const Chat = () => {
  const navigate = useNavigate();
  const { selectedTopic, setSelectedTopic, temptations, therapyTopics } = useTopicSelection();

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