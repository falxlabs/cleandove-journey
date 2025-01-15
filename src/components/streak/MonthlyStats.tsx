import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface MonthlyStatsProps {
  daysCompleted: number | undefined;
  tasksByDate: Record<string, { completed_at: string | null }[]> | undefined;
}

export const MonthlyStats = ({ daysCompleted, tasksByDate }: MonthlyStatsProps) => {
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

  const getDayClassName = (day: Date | undefined) => {
    if (!day || !tasksByDate) return "";

    const dateStr = day.toISOString().split('T')[0];
    const dayTasks = tasksByDate[dateStr];

    if (!dayTasks?.length) return "";

    // Perfect day - all tasks completed
    if (dayTasks.every(task => task.completed_at !== null)) {
      return "perfect-day";
    }
    // Partial completion - at least one task completed
    if (dayTasks.some(task => task.completed_at !== null)) {
      return "partial-day";
    }

    return "";
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
              <span className="text-2xl">✨</span>
              <span className="text-2xl font-bold">{daysCompleted}</span>
            </div>
            <p className="text-sm text-muted-foreground">Perfect days</p>
          </div>
          
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => newDate && setDate(newDate)}
            defaultMonth={date}
            className="rounded-md border"
            disabled={true}
            modifiers={{
              'perfect-day': (date) => getDayClassName(date) === 'perfect-day',
              'partial-day': (date) => getDayClassName(date) === 'partial-day'
            }}
            modifiersClassNames={{
              'perfect-day': "bg-[#9b87f5] text-white hover:bg-[#9b87f5] hover:text-white",
              'partial-day': "bg-black text-white hover:bg-black hover:text-white"
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};