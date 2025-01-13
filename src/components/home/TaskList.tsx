import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { RecurringTaskDialog } from "./RecurringTaskDialog";
import { Button } from "@/components/ui/button";
import { RepeatIcon } from "lucide-react";

interface Task {
  title: string;
  time: string;
  completed: boolean;
  type: string;
}

interface TaskListProps {
  tasks: Task[] | undefined;
  isTasksLoading: boolean;
  onTaskComplete: (taskType: string, completed: boolean) => void;
}

const TaskList = ({ tasks, isTasksLoading, onTaskComplete }: TaskListProps) => {
  const { toast } = useToast();
  const [recurringTask, setRecurringTask] = useState<{
    open: boolean;
    type: string;
    title: string;
  }>({
    open: false,
    type: "",
    title: "",
  });

  const handleTaskClick = async (taskType: string, currentStatus: boolean) => {
    // If task is already completed, don't allow uncompleting
    if (currentStatus) {
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const today = new Date().toISOString().split('T')[0];
      
      // Complete task - upsert to handle potential duplicates
      const { error } = await supabase
        .from('daily_tasks')
        .upsert({
          user_id: session.user.id,
          task_type: taskType,
          date: today,
          completed_at: new Date().toISOString()
        });

      if (error) throw error;

      onTaskComplete(taskType, true);
      
      toast({
        title: "Task completed!",
        description: "Your progress has been updated.",
      });
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update task status.",
      });
    }
  };

  if (isTasksLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {tasks?.map((task) => (
          <div
            key={task.title}
            className={`p-4 bg-card rounded-lg border shadow-sm transition-shadow ${
              !task.completed ? "hover:shadow-md" : ""
            }`}
          >
            <div className="flex justify-between items-center">
              <div
                className={`flex-1 cursor-pointer ${!task.completed ? "cursor-pointer" : ""}`}
                onClick={() => !task.completed && handleTaskClick(task.type, task.completed)}
              >
                <h3 className="font-medium">{task.title}</h3>
                <p className="text-sm text-muted-foreground">{task.time}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setRecurringTask({
                    open: true,
                    type: task.type,
                    title: task.title,
                  })}
                >
                  <RepeatIcon className="h-4 w-4" />
                </Button>
                <div
                  className={`w-6 h-6 rounded-full border-2 transition-colors ${
                    task.completed
                      ? "bg-primary border-primary"
                      : "border-muted-foreground"
                  }`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <RecurringTaskDialog
        open={recurringTask.open}
        onOpenChange={(open) =>
          setRecurringTask((prev) => ({ ...prev, open }))
        }
        taskType={recurringTask.type}
        taskTitle={recurringTask.title}
      />
    </>
  );
};

export default TaskList;