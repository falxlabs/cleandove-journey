import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { RepeatIcon, Trash2 } from "lucide-react";
import { SwipeableItem } from "../chat/SwipeableItem";
import { useState } from "react";
import { TaskDialog } from "./TaskDialog";

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
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleTaskClick = async (task: Task) => {
    setSelectedTask(task);
    setIsDialogOpen(true);
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

  const TaskContent = ({ task }: { task: Task }) => (
    <div 
      className="p-4 bg-card rounded-lg border shadow-sm transition-shadow cursor-pointer"
      onClick={() => handleTaskClick(task)}
    >
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{task.title}</h3>
            {(task.isRecurring || task.type === "reflect") && (
              <RepeatIcon className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
          <p className="text-sm text-muted-foreground">{task.time}</p>
        </div>
        <div className="flex items-center gap-2">
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
  );

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
          task.isCustom ? (
            <SwipeableItem
              key={task.type}
              id={task.type}
              onSwipeComplete={() => handleDeleteTask(task.type)}
            >
              <TaskContent task={task} />
            </SwipeableItem>
          ) : (
            <TaskContent key={task.type} task={task} />
          )
        ))}
      </div>

      {selectedTask && (
        <TaskDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          taskType={selectedTask.type}
          taskTitle={selectedTask.title}
          onComplete={() => onTaskComplete(selectedTask.type, true)}
          isCustomTask={selectedTask.isCustom}
        />
      )}
    </>
  );
};

export default TaskList;