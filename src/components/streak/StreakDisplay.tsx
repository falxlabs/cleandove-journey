import { Skeleton } from "@/components/ui/skeleton";

interface StreakDisplayProps {
  currentStreak: number | undefined;
  isLoading: boolean;
}

export const StreakDisplay = ({ currentStreak, isLoading }: StreakDisplayProps) => {
  return (
    <div className="text-center mb-8">
      {isLoading ? (
        <Skeleton className="h-24 w-24 rounded-full mx-auto mb-4" />
      ) : (
        <>
          <div className="text-8xl font-bold mb-2">{currentStreak || 0}</div>
          <div className="text-xl text-muted-foreground">day streak!</div>
        </>
      )}
    </div>
  );
};