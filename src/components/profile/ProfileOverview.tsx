import { Card } from "@/components/ui/card";

interface ProfileOverviewProps {
  stats: {
    streak: number;
    xp: number;
  };
}

const ProfileOverview = ({ stats }: ProfileOverviewProps) => {
  return (
    <div className="px-6 mt-8">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-2xl font-bold">Overview</h2>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 flex flex-col items-center text-center">
          <div className="bg-orange-500 w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-3">
            🔥
          </div>
          <div className="text-2xl font-bold mb-1">{stats.streak}</div>
          <div className="text-sm text-foreground mb-1">Day streak</div>
          <div className="text-xs text-muted-foreground">Current</div>
        </Card>
        <Card className="p-4 flex flex-col items-center text-center">
          <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-3">
            ✨
          </div>
          <div className="text-2xl font-bold mb-1">{stats.xp}</div>
          <div className="text-sm text-foreground mb-1">Perfect Days</div>
          <div className="text-xs text-muted-foreground">All time</div>
        </Card>
      </div>
    </div>
  );
};

export default ProfileOverview;