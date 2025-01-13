import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
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
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [frequency, setFrequency] = useState("daily");
  const [interval, setInterval] = useState("1");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const { toast } = useToast();

  const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const handleSave = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { error } = await supabase.from("recurring_tasks").insert({
        user_id: session.user.id,
        task_type: taskType,
        start_date: format(startDate, "yyyy-MM-dd"),
        end_date: endDate ? format(endDate, "yyyy-MM-dd") : null,
        frequency,
        interval: parseInt(interval),
        weekdays: frequency === "weekly" ? selectedDays : null,
      });

      if (error) throw error;

      // Create description based on frequency
      let description = `every ${interval} `;
      if (frequency === "daily") {
        description += interval === "1" ? "day" : "days";
      } else if (frequency === "weekly") {
        description += interval === "1" ? "week" : "weeks";
        if (selectedDays.length > 0) {
          description += ` on ${selectedDays.join(", ")}`;
        }
      } else if (frequency === "monthly") {
        description += interval === "1" ? "month" : "months";
      }

      // Call onUpdate with the description if it exists
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
    setSelectedDays((current) =>
      current.includes(day)
        ? current.filter((d) => d !== day)
        : [...current, day]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Make "{taskTitle}" Recurring</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Start Date</Label>
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={(date) => date && setStartDate(date)}
              className="rounded-md border"
            />
          </div>

          <div className="space-y-2">
            <Label>End Date (Optional)</Label>
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={setEndDate}
              className="rounded-md border"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Frequency</Label>
              <Select value={frequency} onValueChange={setFrequency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Every</Label>
              <Input
                type="number"
                min="1"
                value={interval}
                onChange={(e) => setInterval(e.target.value)}
              />
            </div>
          </div>

          {frequency === "weekly" && (
            <div className="space-y-2">
              <Label>Repeat On</Label>
              <div className="flex flex-wrap gap-2">
                {weekDays.map((day) => (
                  <Button
                    key={day}
                    variant={selectedDays.includes(day) ? "default" : "outline"}
                    onClick={() => toggleDay(day)}
                    className="flex-1 min-w-[100px]"
                  >
                    {day}
                  </Button>
                ))}
              </div>
            </div>
          )}
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