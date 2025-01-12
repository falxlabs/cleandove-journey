import { Card } from "@/components/ui/card";

interface PersonalRecordProps {
  title: string;
  value: string;
  date: string;
  icon: string;
  color: string;
  description?: string; // Added description prop but not displaying it in UI
}

const PersonalRecord = ({ title, value, date, icon, color }: PersonalRecordProps) => {
  return (
    <Card className="p-4 flex flex-col items-center text-center">
      <div className={`${color} w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-3`}>
        {icon}
      </div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-sm text-foreground mb-1">{title}</div>
      <div className="text-xs text-muted-foreground">{date}</div>
    </Card>
  );
};

export default PersonalRecord;