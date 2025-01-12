import AwardCard from "./AwardCard";

const awards = [
  {
    title: "Task Master",
    value: "500",
    progress: "3 of 10",
    icon: "📝",
    color: "bg-green-500",
  },
  {
    title: "Perfect Week",
    value: "5",
    progress: "2 of 5",
    icon: "✨",
    color: "bg-purple-500",
  },
  {
    title: "Quest Champion",
    value: "15",
    progress: "9 of 10",
    icon: "🎯",
    color: "bg-orange-500",
  },
  {
    title: "Daily Conqueror",
    value: "10",
    progress: "Locked",
    icon: "🏆",
    color: "bg-gray-300",
    locked: true,
  },
  {
    title: "Streak Master",
    value: "7",
    progress: "Locked",
    icon: "🔥",
    color: "bg-gray-300",
    locked: true,
  },
  {
    title: "Challenge Expert",
    value: "10",
    progress: "Locked",
    icon: "⭐",
    color: "bg-gray-300",
    locked: true,
  },
];

const AwardsSection = () => {
  return (
    <section>
      <h2 className="text-xl font-bold mb-4">Awards</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {awards.map((award, index) => (
          <AwardCard key={index} {...award} />
        ))}
      </div>
    </section>
  );
};

export default AwardsSection;