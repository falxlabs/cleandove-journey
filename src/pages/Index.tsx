import { Calendar } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
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
      <div className="flex-none">
        <header className="px-6 py-8 space-y-4 bg-background">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Today's Quest</h1>
            {isStreakLoading ? (
              <Skeleton className="h-10 w-20" />
            ) : (
              <Button 
                variant="ghost" 
                size="icon" 
                className="px-4 pr-6 gap-0.5"
                onClick={() => navigate('/streak')}
              >
                <span className="text-xl">🔥</span>
                <span className="text-sm text-muted-foreground">{streak}</span>
              </Button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
              <span className="text-2xl">🕊️</span>
            </div>
            <div className="flex-1 flex items-center bg-muted rounded-lg px-4 py-2">
              <p className="text-sm text-muted-foreground">Keep going strong! Your daily spiritual journey continues to inspire.</p>
            </div>
          </div>
        </header>

        <section className="px-6 mb-8 bg-background">
          <div className="flex justify-between mb-4">
            {weekDays.map((day, index) => (
              <div
                key={day}
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  !isStreakLoading && index < streak
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                {isStreakLoading ? (
                  <Skeleton className="h-6 w-6 rounded-full" />
                ) : (
                  day
                )}
              </div>
            ))}
          </div>
          {isProgressLoading ? (
            <Skeleton className="h-2 w-full" />
          ) : (
            <>
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-muted-foreground mt-2">{progress}% completed today</p>
            </>
          )}
        </section>
      </div>

      <ScrollArea className="flex-1 px-6">
        <section className="space-y-4 pb-24">
          {isTasksLoading ? (
            <>
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </>
          ) : (
            tasks?.map((task) => (
              <div
                key={task.title}
                className="p-4 bg-card rounded-lg border shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{task.title}</h3>
                    <p className="text-sm text-muted-foreground">{task.time}</p>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full border-2 ${
                      task.completed
                        ? "bg-primary border-primary"
                        : "border-muted-foreground"
                    }`}
                  />
                </div>
              </div>
            ))
          )}
        </section>
      </ScrollArea>
    </div>
  );
};

export default Index;