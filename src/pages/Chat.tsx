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
    { id: "lust", emoji: "👄", label: "Lust" },
    { id: "alcohol", emoji: "🍺", label: "Alcohol" },
    { id: "cigarettes", emoji: "🚬", label: "Cigarettes" },
    { id: "games", emoji: "🎮", label: "Games" },
    { id: "anger", emoji: "😠", label: "Anger" },
    { id: "anxiety", emoji: "😰", label: "Anxiety" },
    { id: "pride", emoji: "👑", label: "Pride" },
    { id: "greed", emoji: "🤑", label: "Greed" },
    { id: "laziness", emoji: "🦥", label: "Laziness" },
  ];

  const therapyTopics = [
    { id: "cbt", emoji: "🧠", label: "CBT" },
    { id: "mindfulness", emoji: "🧘", label: "Mindfulness" },
    { id: "trauma", emoji: "❤️‍🩹", label: "Trauma" },
    { id: "relationships", emoji: "💝", label: "Relationships" },
    { id: "self-esteem", emoji: "✨", label: "Self-Esteem" },
  ];

  const handleStartChat = () => {
    navigate("/chat/conversation", { 
      state: { 
        topic: selectedTopic,
        mascot: "🕊️"
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
          className="w-full p-6 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <div className="flex justify-between items-center w-full">
            <span className="font-medium">Start New Chat</span>
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
          <h2 className="text-lg font-medium">Ask about...</h2>
          <Carousel className="w-full">
            <CarouselContent>
              {therapyTopics.map((item) => (
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