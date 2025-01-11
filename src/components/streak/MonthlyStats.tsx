import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MonthlyStatsProps {
  daysCompleted: number | undefined;
}

export const MonthlyStats = ({ daysCompleted }: MonthlyStatsProps) => {
  const [date, setDate] = useState<Date>(new Date());
  const currentMonth = date.toLocaleString('default', { month: 'long' });
  const currentYear = date.getFullYear();

  const onPreviousMonth = () => {
    const newDate = new Date(date);
    newDate.setMonth(date.getMonth() - 1);
    setDate(newDate);
  };

  const onNextMonth = () => {
    const newDate = new Date(date);
    newDate.setMonth(date.getMonth() + 1);
    setDate(newDate);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <button onClick={onPreviousMonth} className="p-2 hover:bg-secondary rounded-full transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-semibold">
            {currentMonth} {currentYear}
          </h2>
          <button onClick={onNextMonth} className="p-2 hover:bg-secondary rounded-full transition-colors">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        <div className="grid gap-4">
          <div className="text-center p-4 bg-secondary rounded-lg">
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl">✓</span>
              <span className="text-2xl font-bold">{daysCompleted}</span>
            </div>
            <p className="text-sm text-muted-foreground">Days conquered</p>
          </div>
          
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => newDate && setDate(newDate)}
            defaultMonth={date}
            className="rounded-md border"
          />
        </div>
      </CardContent>
    </Card>
  );
};