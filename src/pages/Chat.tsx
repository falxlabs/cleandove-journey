import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useNavigate } from "react-router-dom";

const Chat = () => {
  const navigate = useNavigate();
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const temptations = [
    { id: "anger", emoji: "😠", label: "Anger" },
    { id: "anxiety", emoji: "😰", label: "Anxiety" },
    { id: "pride", emoji: "😤", label: "Pride" },
    { id: "greed", emoji: "🤑", label: "Greed" },
    { id: "laziness", emoji: "😴", label: "Laziness" },
  ];

  const emotions = [
    { id: "happy", emoji: "😊", label: "Happy" },
    { id: "sad", emoji: "😢", label: "Sad" },
    { id: "worried", emoji: "😟", label: "Worried" },
    { id: "peaceful", emoji: "😌", label: "Peaceful" },
    { id: "excited", emoji: "🤩", label: "Excited" },
  ];

  const handleStartChat = () => {
    navigate("/chat/conversation", { 
      state: { 
        topic: selectedTopic,
        mascot: "🕊️" // Grace the dove
      } 
    });
  };

  return (
    <div className="min-h-screen pb-20 animate-fade-in">
      <header className="px-6 py-8">
        <h1 className="text-2xl font-semibold">Chat with Grace</h1>
        <p className="text-muted-foreground mt-1">Choose a topic to begin</p>
      </header>

      <section className="px-6 space-y-6">
        <Button
          onClick={handleStartChat}
          className="w-full p-4 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <div className="flex justify-between items-center w-full">
            <div>
              <span className="text-xl mr-2">🕊️</span>
              <span className="font-medium">Start New Chat</span>
            </div>
            <ChevronRight className="h-5 w-5" />
          </div>
        </Button>

        <div className="space-y-4">
          <h2 className="text-lg font-medium">I'm struggling with...</h2>
          <Carousel className="w-full">
            <CarouselContent>
              {temptations.map((item) => (
                <CarouselItem key={item.id} className="basis-1/3">
                  <Button
                    variant="outline"
                    className="w-full h-24 flex flex-col items-center justify-center gap-2"
                    onClick={() => setSelectedTopic(item.id)}
                  >
                    <span className="text-2xl">{item.emoji}</span>
                    <span className="text-sm">{item.label}</span>
                  </Button>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-medium">I'm feeling...</h2>
          <Carousel className="w-full">
            <CarouselContent>
              {emotions.map((item) => (
                <CarouselItem key={item.id} className="basis-1/3">
                  <Button
                    variant="outline"
                    className="w-full h-24 flex flex-col items-center justify-center gap-2"
                    onClick={() => setSelectedTopic(item.id)}
                  >
                    <span className="text-2xl">{item.emoji}</span>
                    <span className="text-sm">{item.label}</span>
                  </Button>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>
    </div>
  );
};

export default Chat;