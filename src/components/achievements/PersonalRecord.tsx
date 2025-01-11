import { Card } from "@/components/ui/card";

interface PersonalRecordProps {
  title: string;
  value: string;
  date: string;
  icon: string;
  color: string;
}

const PersonalRecord = ({ title, value, date, icon, color }: PersonalRecordProps) => {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-4">
        <div className={`${color} w-12 h-12 rounded-full flex items-center justify-center text-2xl`}>
          {icon}
        </div>
        <div>
          <div className="text-2xl font-bold">{value}</div>
          <div className="text-sm text-muted-foreground">{title}</div>
          <div className="text-xs text-muted-foreground">{date}</div>
        </div>
      </div>
    </Card>
  );
};

export default PersonalRecord;