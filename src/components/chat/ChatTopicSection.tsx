import { Skeleton } from "@/components/ui/skeleton";
import TopicCarousel from "@/components/TopicCarousel";

interface ChatTopicSectionProps {
  title: string;
  topics: string[];
  onTopicSelect: (topic: string) => void;
  isLoading?: boolean;
}

const ChatTopicSection = ({ title, topics, onTopicSelect, isLoading = false }: ChatTopicSectionProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <TopicCarousel
      title={title}
      topics={topics}
      onTopicSelect={onTopicSelect}
    />
  );
};

export default ChatTopicSection;