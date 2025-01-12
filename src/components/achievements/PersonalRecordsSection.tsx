import PersonalRecord from "./PersonalRecord";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const personalRecords = [
  {
    title: "Total Tasks",
    value: "0",
    date: "Oct 18, 2024",
    icon: "📝",
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
    title: "Perfect Days",
    value: "1",
    date: "Oct 18, 2024",
    icon: "✨",
    color: "bg-green-500",
  },
];

const PersonalRecordsSection = () => {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">Personal Records</h2>
      <Carousel
        opts={{
          align: "start",
          slidesToScroll: 2,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {personalRecords.map((record, index) => (
            <CarouselItem key={index} className="pl-2 md:pl-4 basis-[45%] md:basis-[32%]">
              <PersonalRecord {...record} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
};

export default PersonalRecordsSection;