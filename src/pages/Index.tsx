import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import DailyHeader from "@/components/home/DailyHeader";
import WeekProgress from "@/components/home/WeekProgress";
import TaskList from "@/components/home/TaskList";
import { AddCustomTaskSheet } from "@/components/home/AddCustomTaskSheet";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { startOfWeek, addDays, format } from "date-fns";

const Index = () => {
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [weekCompletions, setWeekCompletions] = useState<{ [key: string]: boolean }>({});
  const [isAddingTask, setIsAddingTask] = useState(false);
  
  // Get the start of the current week (Monday)
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });

  // Fetch completed tasks for the current week
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
  });

  const { data: tasks, isLoading: isTasksLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const defaultTasks = [
        { title: "Reflect with Pace", time: "2 min", type: "reflect", completed: false },
        { title: "Read and Be Inspired", time: "1 min", type: "read", completed: false },
      ];

      const { data: customTasks, error } = await supabase
        .from('custom_tasks')
        .select('title, time, task_type');

      if (error) throw error;

      const formattedCustomTasks = customTasks?.map(task => ({
        title: task.title,
        time: task.time,
        type: task.task_type,
        completed: false
      })) || [];

      return [...defaultTasks, ...formattedCustomTasks];
    },
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

  const progress = tasks && tasks.length > 0 
    ? Math.round((completedTasks.length / tasks.length) * 100) 
    : 0;

  const handleTaskComplete = (taskType: string, completed: boolean) => {
    if (completed) {
      setCompletedTasks(prev => [...prev, taskType]);
      // Update week completions immediately
      const today = format(new Date(), 'yyyy-MM-dd');
      if (tasks && completedTasks.length + 1 === tasks.length) {
        setWeekCompletions(prev => ({
          ...prev,
          [today]: true
        }));
      }
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
            progress={progress}
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
