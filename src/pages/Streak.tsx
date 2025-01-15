import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { StreakHeader } from "@/components/streak/StreakHeader";
import { StreakTabs } from "@/components/streak/StreakTabs";
import { StreakDisplay } from "@/components/streak/StreakDisplay";
import { StreakChallengeCard } from "@/components/streak/StreakChallengeCard";
import { MonthlyStats } from "@/components/streak/MonthlyStats";
import { FriendsContent } from "@/components/streak/FriendsContent";
import { supabase } from "@/integrations/supabase/client";

const Streak = () => {
  const [activeTab, setActiveTab] = useState<"personal" | "friends">("personal");
  const queryClient = useQueryClient();

  const { data: streakData, isLoading: isStreakLoading } = useQuery({
    queryKey: ['streak-data'],
    queryFn: async () => {
      const { data: streakData, error: streakError } = await supabase
        .from('user_streaks')
        .select('current_streak')
        .single();

      if (streakError) throw streakError;

      const { data: taskData, error: taskError } = await supabase
        .from('daily_tasks')
        .select('date, completed_at')
        .order('date', { ascending: false });

      if (taskError) throw taskError;

      // Group tasks by date
      const tasksByDate = taskData.reduce((acc: Record<string, any[]>, task) => {
        const date = task.date;
        if (!acc[date]) acc[date] = [];
        acc[date].push(task);
        return acc;
      }, {});

      // Calculate perfect days (all tasks completed)
      const perfectDays = Object.entries(tasksByDate).filter(([date, tasks]) => {
        return tasks.every(task => task.completed_at !== null);
      }).length;

      return {
        currentStreak: streakData?.current_streak || 0,
        daysCompleted: perfectDays,
        tasksByDate
      };
    },
    staleTime: Infinity,
    refetchOnWindowFocus: true,
    refetchOnMount: true
  });

  return (
    <div className="min-h-screen bg-background text-foreground p-4 animate-fade-in">
      <StreakHeader />
      <StreakTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === "personal" ? (
        <>
          <StreakDisplay 
            currentStreak={streakData?.currentStreak} 
            isLoading={isStreakLoading} 
          />
          <StreakChallengeCard />
          <MonthlyStats 
            daysCompleted={streakData?.daysCompleted}
            tasksByDate={streakData?.tasksByDate}
          />
        </>
      ) : (
        <FriendsContent />
      )}
    </div>
  );
};

export default Streak;