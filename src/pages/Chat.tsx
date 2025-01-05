import { useState } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Frown, Angry, Skull, Ghost, Cigarette, Wine, Beer, Cake, Candy } from "lucide-react";

const Chat = () => {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const temptations = [
    { icon: Frown, label: "Sadness" },
    { icon: Angry, label: "Anger" },
    { icon: Skull, label: "Death" },
    { icon: Ghost, label: "Fear" },
    { icon: Cigarette, label: "Smoking" },
    { icon: Wine, label: "Wine" },
    { icon: Beer, label: "Beer" },
    { icon: Cake, label: "Gluttony" },
    { icon: Candy, label: "Sugar" },
  ];

  const emotions = [
    "😊 Joy",
    "😢 Sadness",
    "😠 Anger",
    "😨 Fear",
    "😌 Peace",
    "🤗 Love",
    "😔 Depression",
    "😤 Frustration",
  ];

  return (
    <div className="min-h-screen pb-20 animate-fade-in">
      <header className="px-6 py-8 text-center">
        <div className="text-6xl mb-4">🕊️</div>
        <h1 className="text-2xl font-semibold">Chat with Grace</h1>
        <p className="text-muted-foreground mt-1">I'm here to help you overcome challenges</p>
      </header>

      <section className="px-6 space-y-8">
        <div className="relative">
          <h2 className="text-lg font-medium mb-4">What's tempting you today?</h2>
          <Carousel className="w-full">
            <CarouselContent>
              {temptations.map((item, index) => (
                <CarouselItem key={index} className="basis-1/3 sm:basis-1/4 md:basis-1/5">
                  <button
                    onClick={() => setSelectedTopic(item.label)}
                    className="w-full aspect-square flex flex-col items-center justify-center gap-2 rounded-lg border bg-card p-2 hover:bg-accent transition-colors"
                  >
                    <item.icon className="h-8 w-8" />
                    <span className="text-xs">{item.label}</span>
                  </button>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>

        <div className="relative">
          <h2 className="text-lg font-medium mb-4">How are you feeling?</h2>
          <Carousel className="w-full">
            <CarouselContent>
              {emotions.map((emotion, index) => (
                <CarouselItem key={index} className="basis-1/3 sm:basis-1/4 md:basis-1/5">
                  <button
                    onClick={() => setSelectedTopic(emotion)}
                    className="w-full aspect-square flex flex-col items-center justify-center gap-2 rounded-lg border bg-card p-2 hover:bg-accent transition-colors"
                  >
                    <span className="text-2xl">{emotion.split(" ")[0]}</span>
                    <span className="text-xs">{emotion.split(" ")[1]}</span>
                  </button>
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