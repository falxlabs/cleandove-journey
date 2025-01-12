import AwardCard from "./AwardCard";

const awards = [
  {
    title: "Task Master",
    value: "100",
    progress: "3 of 100",
    icon: "📝",
    color: "bg-green-500",
    description: "Complete 100 total tasks", // Tracks lifetime task completion
  },
  {
    title: "Perfect Week",
    value: "7",
    progress: "2 of 7",
    icon: "✨",
    color: "bg-purple-500",
    description: "Complete all tasks for 7 consecutive days", // Requires completing all daily tasks
  },
  {
    title: "Steady Streak",
    value: "7",
    progress: "4 of 7",
    icon: "🎯",
    color: "bg-orange-500",
    description: "Complete at least one task daily for 7 days", // More accessible streak achievement
  },
  {
    title: "Perfect Month",
    value: "30",
    progress: "Locked",
    icon: "🌟",
    color: "bg-gray-300",
    locked: true,
    description: "Complete all tasks for 30 consecutive days", // Ultimate perfect streak achievement
  },
  {
    title: "Task Legend",
    value: "500",
    progress: "Locked",
    icon: "👑",
    color: "bg-gray-300",
    locked: true,
    description: "Complete 500 total tasks", // Advanced lifetime achievement
  },
  {
    title: "Weekend Warrior",
    value: "8",
    progress: "Locked",
    icon: "⚔️",
    color: "bg-gray-300",
    locked: true,
    description: "Get perfect days on 8 weekend days", // Weekend-specific challenge
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