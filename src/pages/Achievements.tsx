import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Achievements = () => {
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm">
        <div className="flex items-center p-4 gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-muted rounded-full"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-2xl font-bold">Achievements</h1>
        </div>
      </div>

      <div className="px-4 space-y-8">
        {/* Personal Records */}
        <section>
          <h2 className="text-xl font-bold mb-4">Personal Records</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {personalRecords.map((record, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center gap-4">
                  <div className={`${record.color} w-12 h-12 rounded-full flex items-center justify-center text-2xl`}>
                    {record.icon}
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{record.value}</div>
                    <div className="text-sm text-muted-foreground">{record.title}</div>
                    <div className="text-xs text-muted-foreground">{record.date}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Awards */}
        <section>
          <h2 className="text-xl font-bold mb-4">Awards</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {awards.map((award, index) => (
              <Card 
                key={index} 
                className={`p-4 ${award.locked ? 'opacity-50' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`${award.color} w-12 h-12 rounded-full flex items-center justify-center text-2xl`}>
                    {award.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="text-xl font-bold">{award.value}</div>
                      {award.locked && (
                        <Badge variant="secondary" className="text-xs">
                          Locked
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm font-medium">{award.title}</div>
                    <div className="text-xs text-muted-foreground">{award.progress}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Achievements;