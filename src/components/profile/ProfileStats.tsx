import { Card } from "@/components/ui/card";

interface ProfileStatsProps {
  stats: {
    following: number;
    followers: number;
  };
}

const ProfileStats = ({ stats }: ProfileStatsProps) => {
  return (
    <div className="mt-6 grid grid-cols-2 gap-6 px-6">
      <Card className="p-6 w-full">
        <div className="text-center">
          <div className="text-2xl font-bold">{stats.following}</div>
          <div className="text-sm text-muted-foreground">Following</div>
        </div>
      </Card>
      <Card className="p-6 w-full">
        <div className="text-center">
          <div className="text-2xl font-bold">{stats.followers}</div>
          <div className="text-sm text-muted-foreground">Followers</div>
        </div>
      </Card>
    </div>
  );
};

export default ProfileStats;