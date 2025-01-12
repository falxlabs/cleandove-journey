import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

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

  const handleTaskClick = async (taskType: string, currentStatus: boolean) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const today = new Date().toISOString().split('T')[0];
      const newStatus = !currentStatus;
      
      if (newStatus) {
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
      } else {
        // Uncomplete task - update existing record
        const { error } = await supabase
          .from('daily_tasks')
          .update({ completed_at: null })
          .eq('user_id', session.user.id)
          .eq('task_type', taskType)
          .eq('date', today);

        if (error) throw error;
      }

      onTaskComplete(taskType, newStatus);
      
      toast({
        title: newStatus ? "Task completed!" : "Task uncompleted",
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
    <div className="space-y-4">
      {tasks?.map((task) => (
        <div
          key={task.title}
          className="p-4 bg-card rounded-lg border shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => handleTaskClick(task.type, task.completed)}
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">{task.title}</h3>
              <p className="text-sm text-muted-foreground">{task.time}</p>
            </div>
            <div
              className={`w-6 h-6 rounded-full border-2 transition-colors ${
                task.completed
                  ? "bg-primary border-primary"
                  : "border-muted-foreground"
              }`}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;