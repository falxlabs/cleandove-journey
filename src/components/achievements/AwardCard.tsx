import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AwardCardProps {
  title: string;
  value: string;
  progress: string;
  icon: string;
  color: string;
  locked?: boolean;
  description?: string; // Added description prop but not displaying it in UI
}

const AwardCard = ({ title, value, progress, icon, color, locked }: AwardCardProps) => {
  return (
    <Card className={`p-4 flex flex-col items-center text-center ${locked ? 'opacity-50' : ''}`}>
      <div className={`${color} w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-3`}>
        {icon}
      </div>
      <div className="flex items-center gap-2 mb-1">
        <div className="text-2xl font-bold">{value}</div>
        {locked && (
          <Badge variant="secondary" className="text-xs">
            Locked
          </Badge>
        )}
      </div>
      <div className="text-sm text-foreground mb-1">{title}</div>
      <div className="text-xs text-muted-foreground">{progress}</div>
    </Card>
  );
};

export default AwardCard;