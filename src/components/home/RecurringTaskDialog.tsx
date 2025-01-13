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
  const [monthlyDayOfMonth, setMonthlyDayOfMonth] = useState(format(new Date(), 'd'));
  const { toast } = useToast();

  const weekDays = ["M", "T", "W", "T", "F", "S", "S"];

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
        monthly_pattern: frequency === "monthly" ? "day_of_month" : null,
        monthly_day_of_month: frequency === "monthly" ? monthlyDayOfMonth : null,
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
        description += ` on day ${monthlyDayOfMonth}`;
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
            <div className="space-y-2">
              <Label>Day of month</Label>
              <Input
                type="number"
                min="1"
                max="31"
                value={monthlyDayOfMonth}
                onChange={(e) => setMonthlyDayOfMonth(e.target.value)}
                className="w-full"
              />
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