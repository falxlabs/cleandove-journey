import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { StreakHeader } from "@/components/streak/StreakHeader";
import { StreakTabs } from "@/components/streak/StreakTabs";
import { StreakDisplay } from "@/components/streak/StreakDisplay";
import { StreakChallengeCard } from "@/components/streak/StreakChallengeCard";
import { MonthlyStats } from "@/components/streak/MonthlyStats";

const Streak = () => {
  const [activeTab, setActiveTab] = useState<"personal" | "friends">("personal");

  const { data: streakData, isLoading: isStreakLoading } = useQuery({
    queryKey: ['streak-data'],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        currentStreak: 0,
        daysCompleted: 0,
      };
    },
  });

  return (
    <div className="min-h-screen bg-background text-foreground p-4 animate-fade-in">
      <StreakHeader />
      <StreakTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <StreakDisplay 
        currentStreak={streakData?.currentStreak} 
        isLoading={isStreakLoading} 
      />
      <StreakChallengeCard />
      <MonthlyStats daysCompleted={streakData?.daysCompleted} />
    </div>
  );
};

export default Streak;