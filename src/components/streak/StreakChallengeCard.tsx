import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const StreakChallengeCard = () => {
  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Streak Challenge</h2>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 flex items-center justify-center bg-primary/10 rounded-full">
            <span className="text-2xl">📅</span>
          </div>
          <p className="flex-1">Earn gems by keeping your streak alive!</p>
        </div>
        <Button className="w-full">JOIN CHALLENGE</Button>
      </CardContent>
    </Card>
  );
};