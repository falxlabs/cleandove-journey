import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { RepeatIcon } from "lucide-react";

interface AddCustomTaskSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SUGGESTED_TASKS = [
  { title: "10 Minutes of Meditation", time: "10 min", category: "mindfulness" },
  { title: "Quick Stretching", time: "5 min", category: "exercise" },
  { title: "Gratitude Journaling", time: "5 min", category: "mindfulness" },
  { title: "Deep Breathing", time: "2 min", category: "mindfulness" },
];

export function AddCustomTaskSheet({ open, onOpenChange }: AddCustomTaskSheetProps) {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("5 min");
  const [showRecurring, setShowRecurring] = useState(false);
  const [frequency, setFrequency] = useState("daily");
  const [interval, setInterval] = useState("1");
  const [startDate, setStartDate] = useState<Date>(new Date());
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

  const toggleDay = (day: string) => {
    setSelectedDays((current) =>
      current.includes(day)
        ? current.filter((d) => d !== day)
        : [...current, day]
    );
  };

  const handleAddTask = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const taskType = title.toLowerCase().replace(/\s+/g, '_');

      // First create the custom task
      const { error: taskError, data: taskData } = await supabase
        .from('custom_tasks')
        .insert({
          user_id: session.user.id,
          title,
          time,
          task_type: taskType,
        })
        .select()
        .single();

      if (taskError) throw taskError;

      // If recurring is enabled, create the recurring task
      if (showRecurring) {
        const { error: recurringError } = await supabase
          .from("recurring_tasks")
          .insert({
            user_id: session.user.id,
            task_type: taskType,
            start_date: format(startDate, "yyyy-MM-dd"),
            frequency,
            interval: parseInt(interval),
            weekdays: frequency === "weekly" ? selectedDays : null,
          });

        if (recurringError) throw recurringError;
      }

      toast({
        title: "Task added successfully",
        description: "Your custom task has been created.",
      });
      
      onOpenChange(false);
      setTitle("");
      setTime("5 min");
      setShowRecurring(false);
      setFrequency("daily");
      setInterval("1");
      setStartDate(new Date());
      setSelectedDays([]);
    } catch (error) {
      console.error('Error adding task:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add custom task.",
      });
    }
  };

  const handleSuggestedTaskClick = (task: typeof SUGGESTED_TASKS[0]) => {
    setTitle(task.title);
    setTime(task.time);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[90vh] sm:h-[85vh]">
        <SheetHeader className="mb-6">
          <SheetTitle>Add Custom Task</SheetTitle>
        </SheetHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <Input
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Input
              placeholder="Time (e.g., 5 min)"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
            
            <Button
              variant="outline"
              onClick={() => setShowRecurring(!showRecurring)}
              className="w-full"
            >
              <RepeatIcon className="mr-2 h-4 w-4" />
              Make Recurring
            </Button>

            {showRecurring && (
              <div className="space-y-4 border rounded-lg p-4">
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

                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => date && setStartDate(date)}
                    className="rounded-md border"
                  />
                </div>
              </div>
            )}

            <Button 
              onClick={handleAddTask}
              disabled={!title || !time}
              className="w-full"
            >
              Add Task
            </Button>
          </div>

          <Tabs defaultValue="suggested" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="suggested">Suggested</TabsTrigger>
              <TabsTrigger value="tough">Tough Days</TabsTrigger>
              <TabsTrigger value="sleep">Sleep</TabsTrigger>
              <TabsTrigger value="exercise">Exercise</TabsTrigger>
            </TabsList>
            <TabsContent value="suggested" className="mt-4">
              <div className="grid grid-cols-1 gap-3">
                {SUGGESTED_TASKS.map((task) => (
                  <Button
                    key={task.title}
                    variant="outline"
                    className="justify-between h-auto py-4"
                    onClick={() => handleSuggestedTaskClick(task)}
                  >
                    <span>{task.title}</span>
                    <span className="text-muted-foreground">{task.time}</span>
                  </Button>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}