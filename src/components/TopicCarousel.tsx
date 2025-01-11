import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

interface Topic {
  id: string;
  emoji: string;
  label: string;
}

interface TopicCarouselProps {
  title: string;
  topics: Topic[];
  onTopicSelect: (topicId: string) => void;
}

const TopicCarousel = ({ title, topics, onTopicSelect }: TopicCarouselProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">{title}</h2>
      <Carousel
        opts={{
          align: "start",
          slidesToScroll: 2,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {topics.map((item) => (
            <CarouselItem key={item.id} className="pl-2 md:pl-4 basis-[45%] md:basis-[32%]">
              <Button
                variant="outline"
                className="w-full h-24 flex flex-col items-center justify-center gap-2"
                onClick={() => onTopicSelect(item.id)}
              >
                <span className="text-2xl">{item.emoji}</span>
                <span className="text-sm">{item.label}</span>
              </Button>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default TopicCarousel;