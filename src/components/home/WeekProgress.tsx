import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

interface WeekProgressProps {
  weekDays: string[];
  streak: number | undefined;
  progress: number | undefined;
  isStreakLoading: boolean;
  isProgressLoading: boolean;
}

const WeekProgress = ({ 
  weekDays, 
  streak, 
  progress, 
  isStreakLoading, 
  isProgressLoading 
}: WeekProgressProps) => {
  return (
    <div>
      <div className="flex justify-between mb-4">
        {weekDays.map((day, index) => (
          <div
            key={day}
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              !isStreakLoading && streak !== undefined && index < streak
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
    </div>
  );
};

export default WeekProgress;