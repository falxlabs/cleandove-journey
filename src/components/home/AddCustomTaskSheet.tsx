import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { RepeatIcon } from "lucide-react";
import { RecurringTaskDialog } from "./RecurringTaskDialog";
import { useQueryClient } from "@tanstack/react-query";

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
  const [isRecurringDialogOpen, setIsRecurringDialogOpen] = useState(false);
  const [hasRecurringConfig, setHasRecurringConfig] = useState(false);
  const [recurringDescription, setRecurringDescription] = useState<string>();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleAddTask = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const taskType = title.toLowerCase().replace(/\s+/g, '_');

      // Optimistically update the cache
      const newTask = {
        title,
        time,
        type: taskType,
        completed: false,
        isCustom: true,
        isRecurring: hasRecurringConfig
      };

      // Get the current tasks from the cache
      const previousTasks = queryClient.getQueryData(['tasks']) || [];

      // Optimistically update the cache with the new task
      queryClient.setQueryData(['tasks'], (old: any) => [...(old || []), newTask]);

      const { error: taskError } = await supabase
        .from('custom_tasks')
        .insert({
          user_id: session.user.id,
          title,
          time,
          task_type: taskType,
        });

      if (taskError) throw taskError;

      // Invalidate and refetch to ensure cache is up to date
      queryClient.invalidateQueries({ queryKey: ['tasks'] });

      toast({
        title: "Task added successfully",
        description: "Your custom task has been created.",
      });
      
      onOpenChange(false);
      setTitle("");
      setTime("5 min");
      setHasRecurringConfig(false);
      setRecurringDescription(undefined);
    } catch (error) {
      console.error('Error adding task:', error);
      // Revert the optimistic update on error
      queryClient.setQueryData(['tasks'], previousTasks);
      
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

  const handleRecurringUpdate = (description?: string) => {
    setHasRecurringConfig(!!description);
    setRecurringDescription(description);
  };

  return (
    <>
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
                variant={hasRecurringConfig ? "default" : "outline"}
                onClick={() => setIsRecurringDialogOpen(true)}
                className="w-full"
              >
                <RepeatIcon className="mr-2 h-4 w-4" />
                {hasRecurringConfig ? "Edit Recurring" : "Make Recurring"}
              </Button>

              {recurringDescription && (
                <p className="text-sm text-muted-foreground">
                  Occurs {recurringDescription}
                </p>
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

      <RecurringTaskDialog
        open={isRecurringDialogOpen}
        onOpenChange={setIsRecurringDialogOpen}
        taskType={title.toLowerCase().replace(/\s+/g, '_')}
        taskTitle={title}
        onUpdate={handleRecurringUpdate}
      />
    </>
  );
}