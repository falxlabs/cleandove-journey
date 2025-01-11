import AwardCard from "./AwardCard";

const awards = [
  {
    title: "XP Olympian",
    value: "500",
    progress: "3 of 10",
    icon: "🏃‍♂️",
    color: "bg-pink-500",
  },
  {
    title: "Flawless Finisher",
    value: "5",
    progress: "2 of 5",
    icon: "🎯",
    color: "bg-green-500",
  },
  {
    title: "Word Collector",
    value: "1500",
    progress: "9 of 10",
    icon: "📚",
    color: "bg-purple-500",
  },
  {
    title: "Quest Explorer",
    value: "10",
    progress: "Locked",
    icon: "🗺️",
    color: "bg-gray-300",
    locked: true,
  },
  {
    title: "Perfect Week",
    value: "7",
    progress: "Locked",
    icon: "📅",
    color: "bg-gray-300",
    locked: true,
  },
  {
    title: "Mistake Mechanic",
    value: "10",
    progress: "Locked",
    icon: "🔧",
    color: "bg-gray-300",
    locked: true,
  },
];

const AwardsSection = () => {
  return (
    <section>
      <h2 className="text-xl font-bold mb-4">Awards</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {awards.map((award, index) => (
          <AwardCard key={index} {...award} />
        ))}
      </div>
    </section>
  );
};

export default AwardsSection;