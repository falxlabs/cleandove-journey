import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { startOfWeek, addDays, format } from "date-fns";

interface WeekProgressProps {
  weekDays: string[];
  weekCompletions: { [key: string]: boolean } | undefined;
  progress: number | undefined;
  isStreakLoading: boolean;
  isProgressLoading: boolean;
  isWeekLoading: boolean;
}

const WeekProgress = ({ 
  weekDays, 
  weekCompletions,
  progress, 
  isStreakLoading,
  isProgressLoading,
  isWeekLoading
}: WeekProgressProps) => {
  // Get the start of the current week (Monday)
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });

  return (
    <div>
      <div className="flex justify-between mb-4">
        {weekDays.map((day, index) => {
          const currentDate = format(addDays(weekStart, index), 'yyyy-MM-dd');
          const isToday = currentDate === format(today, 'yyyy-MM-dd');
          const hasCompletedTasks = weekCompletions?.[currentDate];

          let circleClassName = "w-10 h-10 rounded-full flex items-center justify-center transition-colors ";

          if (!isWeekLoading) {
            if (isToday) {
              // Today's circle: purple for 100%, black for partial, secondary for none
              if (progress === 100) {
                circleClassName += "bg-[#9b87f5] text-primary-foreground";
              } else if (progress && progress > 0) {
                circleClassName += "bg-black text-white";
              } else {
                circleClassName += "bg-secondary text-secondary-foreground";
              }
            } else {
              // Past/Future days: purple for completed, secondary for not
              if (hasCompletedTasks) {
                circleClassName += "bg-[#9b87f5] text-primary-foreground";
              } else {
                circleClassName += "bg-secondary text-secondary-foreground";
              }
            }
          } else {
            circleClassName += "bg-secondary text-secondary-foreground";
          }

          return (
            <div
              key={`${day}-${index}`}
              className={circleClassName}
            >
              {isStreakLoading ? (
                <Skeleton className="h-6 w-6 rounded-full" />
              ) : (
                day
              )}
            </div>
          );
        })}
      </div>
      {isProgressLoading ? (
        <Skeleton className="h-2 w-full" />
      ) : (
        <>
          <Progress 
            value={progress} 
            className="h-2"
          />
          <p className="text-sm text-muted-foreground mt-2">
            {progress}% completed today
          </p>
        </>
      )}
    </div>
  );
};

export default WeekProgress;