import PersonalRecord from "./PersonalRecord";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const personalRecords = [
  {
    title: "Total XP",
    value: "0",
    date: "Oct 18, 2024",
    icon: "🏆",
    color: "bg-yellow-500",
  },
  {
    title: "Longest Streak",
    value: "1",
    date: "Oct 18, 2024",
    icon: "🔥",
    color: "bg-orange-500",
  },
  {
    title: "Perfect Lessons",
    value: "1",
    date: "Oct 18, 2024",
    icon: "✨",
    color: "bg-green-500",
  },
];

const PersonalRecordsSection = () => {
  return (
    <section>
      <h2 className="text-xl font-bold mb-4">Personal Records</h2>
      <Carousel className="w-full">
        <CarouselContent>
          {personalRecords.map((record, index) => (
            <CarouselItem key={index} className="basis-1/2 md:basis-1/3">
              <PersonalRecord {...record} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
};

export default PersonalRecordsSection;