import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import DailyHeader from "@/components/home/DailyHeader";
import WeekProgress from "@/components/home/WeekProgress";
import TaskList from "@/components/home/TaskList";
import { AddCustomTaskSheet } from "@/components/home/AddCustomTaskSheet";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { startOfWeek, addDays, format } from "date-fns";
import { shouldShowRecurringTask } from "@/utils/taskUtils";

const Index = () => {
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [weekCompletions, setWeekCompletions] = useState<{ [key: string]: boolean }>({});
  const [isAddingTask, setIsAddingTask] = useState(false);
  const queryClient = useQueryClient();
  
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });

  const { data: weekCompletionsData, isLoading: isWeekLoading } = useQuery({
    queryKey: ['week-completions'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return {};

      const weekDates = Array.from({ length: 7 }, (_, i) => 
        format(addDays(weekStart, i), 'yyyy-MM-dd')
      );

      const { data, error } = await supabase
        .from('daily_tasks')
        .select('date')
        .eq('user_id', session.user.id)
        .in('date', weekDates)
        .not('completed_at', 'is', null);

      if (error) throw error;
      
      return data.reduce((acc: { [key: string]: boolean }, task) => {
        acc[task.date] = true;
        return acc;
      }, {});
    },
    staleTime: Infinity, // Data won't become stale automatically
    refetchOnWindowFocus: true, // Refetch when window regains focus
    refetchOnMount: true, // Refetch when component mounts
  });

  const { data: streak, isLoading: isStreakLoading } = useQuery({
    queryKey: ['streak'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return 0;

      const { data, error } = await supabase
        .from('user_streaks')
        .select('current_streak')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (error) throw error;
      return data?.current_streak || 0;
    },
    staleTime: Infinity, // Data won't become stale automatically
    refetchOnWindowFocus: true, // Refetch when window regains focus
    refetchOnMount: true, // Refetch when component mounts
  });

  const { data: tasks, isLoading: isTasksLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const defaultTasks = [
        { title: "Reflect with Pace", time: "2 min", type: "reflect", completed: false, isCustom: false },
        { title: "Read and Be Inspired", time: "1 min", type: "read", completed: false, isCustom: false },
      ];

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return defaultTasks;

      const today = format(new Date(), 'yyyy-MM-dd');

      // Fetch custom tasks created today
      const { data: customTasks, error: customError } = await supabase
        .from('custom_tasks')
        .select('title, time, task_type, created_at');

      if (customError) throw customError;

      // Fetch recurring tasks
      const { data: recurringTasks, error: recurringError } = await supabase
        .from('recurring_tasks')
        .select('*');

      if (recurringError) throw recurringError;

      // Filter custom tasks to only show those created today or with recurring configuration
      const recurringTaskTypes = recurringTasks
        .filter(task => shouldShowRecurringTask(task))
        .map(task => task.task_type);

      const formattedCustomTasks = customTasks
        ?.filter(task => {
          const taskDate = format(new Date(task.created_at), 'yyyy-MM-dd');
          return taskDate === today || recurringTaskTypes.includes(task.task_type);
        })
        .map(task => ({
          title: task.title,
          time: task.time,
          type: task.task_type,
          completed: false,
          isCustom: true,
          isRecurring: recurringTaskTypes.includes(task.task_type)
        })) || [];

      return [...defaultTasks, ...formattedCustomTasks];
    },
    staleTime: Infinity, // Data won't become stale automatically
    refetchOnWindowFocus: true, // Refetch when window regains focus
    refetchOnMount: true, // Refetch when component mounts
  });

  const { data: completedTasksData } = useQuery({
    queryKey: ['completed-tasks'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return [];

      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('daily_tasks')
        .select('task_type')
        .eq('user_id', session.user.id)
        .eq('date', today);

      if (error) throw error;
      return data.map(task => task.task_type);
    },
    staleTime: Infinity, // Data won't become stale automatically
    refetchOnWindowFocus: true, // Refetch when window regains focus
    refetchOnMount: true, // Refetch when component mounts
  });

  useEffect(() => {
    if (completedTasksData) {
      setCompletedTasks(completedTasksData);
    }
  }, [completedTasksData]);

  useEffect(() => {
    if (weekCompletionsData) {
      setWeekCompletions(weekCompletionsData);
    }
  }, [weekCompletionsData]);

  const handleTaskComplete = (taskType: string, completed: boolean) => {
    if (completed) {
      setCompletedTasks(prev => [...prev, taskType]);
      const today = format(new Date(), 'yyyy-MM-dd');
      if (tasks && completedTasks.length + 1 === tasks.length) {
        setWeekCompletions(prev => ({
          ...prev,
          [today]: true
        }));
      }
      // Invalidate relevant queries when a task is completed
      queryClient.invalidateQueries({ queryKey: ['streak'] });
      queryClient.invalidateQueries({ queryKey: ['week-completions'] });
      queryClient.invalidateQueries({ queryKey: ['completed-tasks'] });
    } else {
      setCompletedTasks(prev => prev.filter(t => t !== taskType));
    }
  };

  const tasksWithCompletion = tasks?.map(task => ({
    ...task,
    completed: completedTasks.includes(task.type)
  }));

  return (
    <div className="min-h-screen flex flex-col animate-fade-in">
      <div className="flex-none sticky top-0 z-10 bg-background border-b shadow-sm">
        <header className="px-6 py-8">
          <DailyHeader 
            streak={streak} 
            isStreakLoading={isStreakLoading} 
          />
        </header>

        <section className="px-6 mb-8">
          <WeekProgress
            weekDays={weekDays}
            weekCompletions={weekCompletions}
            progress={tasks && tasks.length > 0 
              ? Math.round((completedTasks.length / tasks.length) * 100) 
              : 0}
            isStreakLoading={isStreakLoading}
            isProgressLoading={isTasksLoading}
            isWeekLoading={isWeekLoading}
          />
        </section>
      </div>

      <ScrollArea className="flex-1 px-6 pt-4">
        <section className="space-y-4 pb-24">
          <TaskList 
            tasks={tasksWithCompletion} 
            isTasksLoading={isTasksLoading}
            onTaskComplete={handleTaskComplete}
          />
          
          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={() => setIsAddingTask(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Custom Task
          </Button>
        </section>
      </ScrollArea>

      <AddCustomTaskSheet 
        open={isAddingTask} 
        onOpenChange={setIsAddingTask}
      />
    </div>
  );
};

export default Index;
