import { Card, CardContent } from "@/components/ui/card";

export const PerfectStreakCard = () => {
  return (
    <Card className="mb-8 bg-card/50 backdrop-blur">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 flex items-center justify-center bg-primary/10 rounded-full">
            <span className="text-2xl">🔥</span>
          </div>
          <div className="flex-1">
            <p className="text-sm">
              Do a lesson every day this week to earn this{" "}
              <span className="text-primary font-medium">Perfect Streak</span> flame!
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};