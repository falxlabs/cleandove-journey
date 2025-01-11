import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface ProfileAchievementsProps {
  achievements: Array<{
    icon: string;
    color: string;
    title: string;
    progress: string;
  }>;
}

const ProfileAchievements = ({ achievements }: ProfileAchievementsProps) => {
  const navigate = useNavigate();

  return (
    <div className="px-6 mt-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold">Achievements</h2>
        </div>
        <Button 
          variant="ghost" 
          className="text-primary hover:text-primary/90 font-medium"
          onClick={() => navigate('/achievements')}
        >
          View All
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {achievements.slice(0, 2).map((achievement, index) => (
          <Card key={index} className="p-4 flex flex-col items-center text-center">
            <div className={`${achievement.color} w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-3`}>
              {achievement.icon}
            </div>
            <div className="font-semibold mb-1">{achievement.title}</div>
            <div className="text-sm text-muted-foreground">{achievement.progress}</div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProfileAchievements;