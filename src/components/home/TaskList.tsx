import { Skeleton } from "@/components/ui/skeleton";

interface Task {
  title: string;
  time: string;
  completed: boolean;
}

interface TaskListProps {
  tasks: Task[] | undefined;
  isTasksLoading: boolean;
}

const TaskList = ({ tasks, isTasksLoading }: TaskListProps) => {
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
          className="p-4 bg-card rounded-lg border shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">{task.title}</h3>
              <p className="text-sm text-muted-foreground">{task.time}</p>
            </div>
            <div
              className={`w-6 h-6 rounded-full border-2 ${
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