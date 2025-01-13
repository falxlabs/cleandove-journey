import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RepeatIcon, Trash2Icon } from "lucide-react";

interface Task {
  title: string;
  time: string;
  completed: boolean;
  type: string;
  isRecurring?: boolean;
  isCustom?: boolean;
}

interface TaskListProps {
  tasks: Task[] | undefined;
  isTasksLoading: boolean;
  onTaskComplete: (taskType: string, completed: boolean) => void;
}

const TaskList = ({ tasks, isTasksLoading, onTaskComplete }: TaskListProps) => {
  const { toast } = useToast();

  const handleTaskClick = async (taskType: string, currentStatus: boolean) => {
    if (currentStatus) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const today = new Date().toISOString().split('T')[0];
      
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

  const handleDeleteTask = async (taskType: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { error } = await supabase
        .from('custom_tasks')
        .delete()
        .eq('user_id', session.user.id)
        .eq('task_type', taskType);

      if (error) throw error;

      // Also delete any recurring configuration
      await supabase
        .from('recurring_tasks')
        .delete()
        .eq('user_id', session.user.id)
        .eq('task_type', taskType);

      toast({
        title: "Task deleted",
        description: "Your custom task has been removed.",
      });

      // Refresh the page to update the task list
      window.location.reload();
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete custom task.",
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
              {task.isRecurring && (
                <RepeatIcon className="h-4 w-4 text-muted-foreground" />
              )}
              {task.isCustom && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteTask(task.type)}
                >
                  <Trash2Icon className="h-4 w-4" />
                </Button>
              )}
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
  );
};

export default TaskList;