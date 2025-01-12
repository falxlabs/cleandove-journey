import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EyeOff } from "lucide-react";

interface Level {
  value: number;
  requirement: string;
}

interface AwardCardProps {
  title: string;
  levels: Level[];
  currentLevel: number;
  progress: string;
  icon: string;
  color: string;
  isSecret?: boolean;
  description?: string;
}

const AwardCard = ({ 
  title, 
  levels, 
  currentLevel, 
  progress, 
  icon, 
  color,
  isSecret
}: AwardCardProps) => {
  const hasProgress = progress !== "0 of 1" && progress !== "0 of 3" && 
                     progress !== "0 of 5" && progress !== "0 of 7" &&
                     progress !== "0 of 10" && progress !== "0 of 25" &&
                     progress !== "0 of 50" && progress !== "0 of 100";

  return (
    <Card className={`p-4 flex flex-col items-center text-center ${!hasProgress ? 'opacity-50' : ''}`}>
      {isSecret ? (
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-3 bg-gray-200">
          <EyeOff className="w-8 h-8 text-gray-500" />
        </div>
      ) : (
        <div className={`${color} w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-3`}>
          {icon}
        </div>
      )}
      <div className="text-sm text-foreground mb-1">
        {isSecret ? "???" : title}
      </div>
      <div className="flex items-center gap-2 mb-1">
        {!isSecret && (
          <Badge variant="secondary" className="text-xs">
            Level {currentLevel + 1}
          </Badge>
        )}
      </div>
      <div className="text-xs text-muted-foreground">
        {isSecret ? "Keep exploring..." : progress}
      </div>
    </Card>
  );
};

export default AwardCard;