import AwardCard from "./AwardCard";

const awards = [
  {
    title: "Task Master",
    levels: [
      { value: 1, requirement: "Complete 1 task" },
      { value: 5, requirement: "Complete 5 tasks" },
      { value: 10, requirement: "Complete 10 tasks" },
      { value: 25, requirement: "Complete 25 tasks" },
      { value: 50, requirement: "Complete 50 tasks" },
      { value: 100, requirement: "Complete 100 tasks" },
      { value: 250, requirement: "Complete 250 tasks" },
      { value: 500, requirement: "Complete 500 tasks" },
    ],
    currentLevel: 2,
    progress: "3 of 5",
    icon: "📝",
    color: "bg-green-500",
    description: "Master the art of task completion",
  },
  {
    title: "Perfect Streak",
    levels: [
      { value: 1, requirement: "Get 1 perfect day" },
      { value: 3, requirement: "Get 3 perfect days" },
      { value: 7, requirement: "Get 7 perfect days" },
      { value: 14, requirement: "Get 14 perfect days" },
      { value: 30, requirement: "Get 30 perfect days" },
      { value: 60, requirement: "Get 60 perfect days" },
      { value: 90, requirement: "Get 90 perfect days" },
      { value: 180, requirement: "Get 180 perfect days" },
    ],
    currentLevel: 1,
    progress: "2 of 3",
    icon: "✨",
    color: "bg-purple-500",
    description: "Complete all daily tasks consistently",
  },
  {
    title: "Steady Streak",
    levels: [
      { value: 1, requirement: "Complete 1 day streak" },
      { value: 3, requirement: "Complete 3 day streak" },
      { value: 7, requirement: "Complete 7 day streak" },
      { value: 14, requirement: "Complete 14 day streak" },
      { value: 30, requirement: "Complete 30 day streak" },
      { value: 60, requirement: "Complete 60 day streak" },
      { value: 90, requirement: "Complete 90 day streak" },
      { value: 180, requirement: "Complete 180 day streak" },
    ],
    currentLevel: 0,
    progress: "0 of 1",
    icon: "🎯",
    color: "bg-orange-500",
    description: "Maintain a consistent daily task streak",
  },
  {
    title: "Weekend Champion",
    levels: [
      { value: 1, requirement: "Complete 1 weekend day" },
      { value: 2, requirement: "Complete 2 weekend days" },
      { value: 4, requirement: "Complete 4 weekend days" },
      { value: 8, requirement: "Complete 8 weekend days" },
      { value: 12, requirement: "Complete 12 weekend days" },
      { value: 16, requirement: "Complete 16 weekend days" },
      { value: 20, requirement: "Complete 20 weekend days" },
      { value: 30, requirement: "Complete 30 weekend days" },
    ],
    currentLevel: 0,
    progress: "0 of 1",
    icon: "⚔️",
    color: "bg-blue-500",
    description: "Master weekend productivity",
  },
  {
    title: "Early Bird",
    levels: [
      { value: 1, requirement: "Complete 1 task before 9 AM" },
      { value: 5, requirement: "Complete 5 tasks before 9 AM" },
      { value: 10, requirement: "Complete 10 tasks before 9 AM" },
      { value: 25, requirement: "Complete 25 tasks before 9 AM" },
      { value: 50, requirement: "Complete 50 tasks before 9 AM" },
      { value: 100, requirement: "Complete 100 tasks before 9 AM" },
      { value: 200, requirement: "Complete 200 tasks before 9 AM" },
      { value: 365, requirement: "Complete 365 tasks before 9 AM" },
    ],
    currentLevel: 0,
    progress: "0 of 1",
    icon: "🌅",
    color: "bg-yellow-500",
    description: "Complete tasks early in the morning",
  },
  {
    title: "Task Variety",
    levels: [
      { value: 1, requirement: "Complete 1 different task type" },
      { value: 3, requirement: "Complete 3 different task types" },
      { value: 5, requirement: "Complete 5 different task types" },
      { value: 8, requirement: "Complete 8 different task types" },
      { value: 12, requirement: "Complete 12 different task types" },
      { value: 15, requirement: "Complete 15 different task types" },
      { value: 20, requirement: "Complete 20 different task types" },
      { value: 25, requirement: "Complete 25 different task types" },
    ],
    currentLevel: 0,
    progress: "0 of 1",
    icon: "🎨",
    color: "bg-pink-500",
    description: "Complete various types of tasks",
  },
  {
    title: "Secret Achievement",
    levels: [
      { value: 1, requirement: "???" },
      { value: 2, requirement: "???" },
      { value: 3, requirement: "???" },
      { value: 4, requirement: "???" },
      { value: 5, requirement: "???" },
      { value: 6, requirement: "???" },
      { value: 7, requirement: "???" },
      { value: 8, requirement: "???" },
    ],
    currentLevel: 0,
    progress: "???",
    icon: "🤫",
    color: "bg-gray-500",
    description: "???",
    isSecret: true,
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