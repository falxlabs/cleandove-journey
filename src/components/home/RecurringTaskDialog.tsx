import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface RecurringTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskType: string;
  taskTitle: string;
  onUpdate?: (description?: string) => void;
}

export function RecurringTaskDialog({
  open,
  onOpenChange,
  taskType,
  taskTitle,
  onUpdate,
}: RecurringTaskDialogProps) {
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [frequency, setFrequency] = useState("daily");
  const [interval, setInterval] = useState("1");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [monthlyPattern, setMonthlyPattern] = useState("day_of_month");
  const [monthlyDayOfMonth, setMonthlyDayOfMonth] = useState("1");
  const [monthlyDayOfWeek, setMonthlyDayOfWeek] = useState("Monday");
  const [monthlyWeekOfMonth, setMonthlyWeekOfMonth] = useState("first");
  const { toast } = useToast();

  const weekDays = ["M", "T", "W", "T", "F", "S", "S"];
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const weeksOfMonth = ["first", "second", "third", "fourth", "last"];

  useEffect(() => {
    if (frequency === "daily" && interval === "1") {
      setSelectedDays(weekDays);
    } else if (frequency === "weekly") {
      if (selectedDays.length === 0) {
        const today = new Date().getDay();
        const dayIndex = today === 0 ? 6 : today - 1;
        setSelectedDays([weekDays[dayIndex]]);
      }
    } else {
      setSelectedDays([]);
    }
  }, [frequency, interval]);

  const handleSave = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { error } = await supabase.from("recurring_tasks").insert({
        user_id: session.user.id,
        task_type: taskType,
        start_date: startDate,
        frequency,
        interval: parseInt(interval),
        weekdays: frequency === "weekly" || (frequency === "daily" && interval === "1") 
          ? selectedDays 
          : null,
        monthly_pattern: frequency === "monthly" ? monthlyPattern : null,
        monthly_day_of_week: frequency === "monthly" && monthlyPattern === "day_of_week" ? monthlyDayOfWeek : null,
        monthly_week_of_month: frequency === "monthly" && monthlyPattern === "day_of_week" ? monthlyWeekOfMonth : null,
      });

      if (error) throw error;

      let description = `every ${interval} `;
      if (frequency === "daily") {
        description += interval === "1" ? "day" : "days";
        if (interval === "1" && selectedDays.length > 0) {
          description += ` on ${selectedDays.join(", ")}`;
        }
      } else if (frequency === "weekly") {
        description += interval === "1" ? "week" : "weeks";
        if (selectedDays.length > 0) {
          description += ` on ${selectedDays.join(", ")}`;
        }
      } else if (frequency === "monthly") {
        description += interval === "1" ? "month" : "months";
        if (monthlyPattern === "day_of_month") {
          description += ` on day ${monthlyDayOfMonth}`;
        } else {
          description += ` on the ${monthlyWeekOfMonth} ${monthlyDayOfWeek}`;
        }
      }

      onUpdate?.(description);
      toast({
        title: "Success",
        description: "Recurring task has been set up.",
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Error setting up recurring task:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to set up recurring task.",
      });
    }
  };

  const toggleDay = (day: string) => {
    if (frequency === "daily" && interval === "1") {
      if (selectedDays.includes(day)) {
        setFrequency("weekly");
        setSelectedDays(weekDays.filter(d => d !== day));
      }
    } else {
      setSelectedDays(current =>
        current.includes(day)
          ? current.filter(d => d !== day)
          : [...current, day]
      );
    }
  };

  const showDaySelection = frequency === "weekly" || (frequency === "daily" && interval === "1");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Repeat "{taskTitle}"</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Every</Label>
              <Input
                type="number"
                min="1"
                value={interval}
                onChange={(e) => setInterval(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label>Frequency</Label>
              <Select value={frequency} onValueChange={setFrequency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Day(s)</SelectItem>
                  <SelectItem value="weekly">Week(s)</SelectItem>
                  <SelectItem value="monthly">Month(s)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {showDaySelection && (
            <div className="space-y-2">
              <Label>On</Label>
              <div className="flex gap-1">
                {weekDays.map((day) => (
                  <Button
                    key={day}
                    size="sm"
                    variant={selectedDays.includes(day) ? "default" : "outline"}
                    onClick={() => toggleDay(day)}
                    className="w-8 h-8 p-0"
                  >
                    {day}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {frequency === "monthly" && (
            <div className="space-y-4">
              <RadioGroup value={monthlyPattern} onValueChange={setMonthlyPattern}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="day_of_month" id="day_of_month" />
                  <Label htmlFor="day_of_month">Day of month</Label>
                  {monthlyPattern === "day_of_month" && (
                    <Input
                      type="number"
                      min="1"
                      max="31"
                      value={monthlyDayOfMonth}
                      onChange={(e) => setMonthlyDayOfMonth(e.target.value)}
                      className="w-20 ml-2"
                    />
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="day_of_week" id="day_of_week" />
                  <Label htmlFor="day_of_week">Day of week</Label>
                </div>
              </RadioGroup>

              {monthlyPattern === "day_of_week" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Week</Label>
                    <Select value={monthlyWeekOfMonth} onValueChange={setMonthlyWeekOfMonth}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {weeksOfMonth.map((week) => (
                          <SelectItem key={week} value={week}>
                            {week}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Day</Label>
                    <Select value={monthlyDayOfWeek} onValueChange={setMonthlyDayOfWeek}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {daysOfWeek.map((day) => (
                          <SelectItem key={day} value={day}>
                            {day}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label>Start date</Label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}