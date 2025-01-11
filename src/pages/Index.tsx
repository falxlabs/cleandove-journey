import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import DailyHeader from "@/components/home/DailyHeader";
import WeekProgress from "@/components/home/WeekProgress";
import TaskList from "@/components/home/TaskList";

const Index = () => {
  const weekDays = ["M", "T", "W", "T", "F", "S", "S"];
  
  const { data: streak, isLoading: isStreakLoading } = useQuery({
    queryKey: ['streak'],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return 3;
    },
  });

  const { data: progress, isLoading: isProgressLoading } = useQuery({
    queryKey: ['progress'],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return 43;
    },
  });

  const { data: tasks, isLoading: isTasksLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return [
        { title: "Morning Reflection", time: "5 min", completed: false },
        { title: "Daily Scripture", time: "10 min", completed: true },
        { title: "Evening Check-in", time: "5 min", completed: false },
      ];
    },
  });

  return (
    <div className="min-h-screen flex flex-col animate-fade-in">
      <div className="flex-none sticky top-0 z-10 bg-background border-b shadow-sm">
        <header className="px-6 py-8">
          <DailyHeader 
            streak={streak} 
            isStreakLoading={isStreakLoading} 
          />
        </header>

        <section className="px-6 mb-8">
          <WeekProgress
            weekDays={weekDays}
            streak={streak}
            progress={progress}
            isStreakLoading={isStreakLoading}
            isProgressLoading={isProgressLoading}
          />
        </section>
      </div>

      <ScrollArea className="flex-1 px-6 pt-4">
        <section className="space-y-4 pb-24">
          <TaskList 
            tasks={tasks} 
            isTasksLoading={isTasksLoading} 
          />
        </section>
      </ScrollArea>
    </div>
  );
};

export default Index;