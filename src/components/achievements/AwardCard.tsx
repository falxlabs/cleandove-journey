import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AwardCardProps {
  title: string;
  value: string;
  progress: string;
  icon: string;
  color: string;
  locked?: boolean;
}

const AwardCard = ({ title, value, progress, icon, color, locked }: AwardCardProps) => {
  return (
    <Card className={`p-4 ${locked ? 'opacity-50' : ''}`}>
      <div className="flex items-center gap-4">
        <div className={`${color} w-12 h-12 rounded-full flex items-center justify-center text-2xl`}>
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className="text-xl font-bold">{value}</div>
            {locked && (
              <Badge variant="secondary" className="text-xs">
                Locked
              </Badge>
            )}
          </div>
          <div className="text-sm font-medium">{title}</div>
          <div className="text-xs text-muted-foreground">{progress}</div>
        </div>
      </div>
    </Card>
  );
};

export default AwardCard;