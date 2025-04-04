import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { RepeatIcon } from "lucide-react";
import { SwipeableItem } from "../chat/SwipeableItem";
import { useState } from "react";
import { TaskDialog } from "./TaskDialog";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

interface Task {
  title: string;
  time: string;
  completed: boolean;
  type: string;
  isRecurring?: boolean;
  isCustom?: boolean;
  chatId?: string;
}

interface TaskListProps {
  tasks: Task[] | undefined;
  isTasksLoading: boolean;
  onTaskComplete: (taskType: string, completed: boolean, chatId?: string) => void;
}

const TaskList = ({ tasks, isTasksLoading, onTaskComplete }: TaskListProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleTaskClick = async (task: Task) => {
    if (task.type === "reflect") {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Please sign in to continue.",
          });
          return;
        }

        // Check if there's already a reflection chat for today
        const today = format(new Date(), 'yyyy-MM-dd');
        const { data: existingTask, error } = await supabase
          .from('daily_tasks')
          .select('chat_id')
          .eq('user_id', session.user.id)
          .eq('date', today)
          .eq('task_type', 'reflect')
          .maybeSingle();

        if (error) {
          console.error('Error checking for existing reflection:', error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to check for existing reflection.",
          });
          return;
        }

        if (existingTask?.chat_id) {
          // If there's an existing chat, navigate to it
          navigate('/conversation', { 
            state: { 
              chatId: existingTask.chat_id,
              topic: 'reflect',
              isExistingChat: true,
              from: '/'
            }
          });
        } else {
          // If no existing chat, start a new reflection
          navigate('/conversation', { 
            state: { 
              topic: 'reflect',
              from: '/'
            }
          });
        }
        return;
      } catch (error) {
        console.error('Error checking for existing reflection:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to check for existing reflection.",
        });
      }
    }
    
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
            {(task.isRecurring || task.type === "reflect" || task.type === "read") && (
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
          onComplete={() => onTaskComplete(selectedTask.type, true, selectedTask.chatId)}
          isCustomTask={selectedTask.isCustom}
          chatId={selectedTask.chatId}
        />
      )}
    </>
  );
};

export default TaskList;