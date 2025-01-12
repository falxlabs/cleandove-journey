import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
  locked?: boolean;
  description?: string;
  isSecret?: boolean;
}

const AwardCard = ({ 
  title, 
  levels, 
  currentLevel, 
  progress, 
  icon, 
  color, 
  locked,
  isSecret 
}: AwardCardProps) => {
  return (
    <Card className={`p-4 flex flex-col items-center text-center ${locked ? 'opacity-50' : ''}`}>
      <div className={`${color} w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-3`}>
        {icon}
      </div>
      <div className="text-sm text-foreground mb-1">{title}</div>
      <div className="flex items-center gap-2 mb-1">
        {locked ? (
          <Badge variant="secondary" className="text-xs">
            Locked
          </Badge>
        ) : (
          <Badge variant="secondary" className="text-xs">
            Level {currentLevel + 1}
          </Badge>
        )}
      </div>
      <div className="text-xs text-muted-foreground">
        {isSecret ? "???" : progress}
      </div>
    </Card>
  );
};

export default AwardCard;