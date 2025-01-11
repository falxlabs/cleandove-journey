import PersonalRecord from "./PersonalRecord";

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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {personalRecords.map((record, index) => (
          <PersonalRecord key={index} {...record} />
        ))}
      </div>
    </section>
  );
};

export default PersonalRecordsSection;