import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import TopicCarousel from "@/components/TopicCarousel";
import { useTopicSelection } from "@/hooks/useTopicSelection";

const Chat = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedTopic, setSelectedTopic, improvements, temptations, therapyTopics } = useTopicSelection();

  const handleStartChat = () => {
    navigate("/chat/conversation", {
      state: {
        topic: selectedTopic,
        mascot: "🕊️",
        context: selectedTopic ? `I want to improve my ${selectedTopic}` : undefined,
        improvement: selectedTopic ? improvements.find(i => i.id === selectedTopic)?.label : undefined,
        from: location.pathname
      },
    });
  };

  const handleTopicSelect = (topicId: string) => {
    setSelectedTopic(topicId);
    navigate("/chat/conversation", {
      state: {
        topic: topicId,
        mascot: "🕊️",
        context: `I want to improve my ${topicId}`,
        improvement: improvements.find(i => i.id === topicId)?.label || 
                    temptations.find(i => i.id === topicId)?.label ||
                    therapyTopics.find(i => i.id === topicId)?.label,
        from: location.pathname
      },
    });
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="sticky top-0 z-10 bg-background border-b shadow-sm">
        <PageHeader
          title="Chat"
          emoji="🕊️"
          description="Choose a topic to begin"
        />

        <div className="px-6 pb-4">
          <Button
            onClick={handleStartChat}
            className="w-full p-6 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <div className="flex justify-between items-center w-full">
              <span className="font-medium">Start New Chat</span>
              <ChevronRight className="h-5 w-5" />
            </div>
          </Button>
        </div>
      </div>

      <section className="px-6 space-y-6 pt-4">
        <TopicCarousel
          title="I want to improve..."
          topics={improvements}
          onTopicSelect={handleTopicSelect}
        />

        <TopicCarousel
          title="I'm struggling with..."
          topics={temptations}
          onTopicSelect={handleTopicSelect}
        />

        <TopicCarousel
          title="Ask about..."
          topics={therapyTopics}
          onTopicSelect={handleTopicSelect}
        />
      </section>
    </div>
  );
};

export default Chat;