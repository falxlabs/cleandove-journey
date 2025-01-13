import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  const { toast } = useToast();

  const handleAddTask = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const taskType = title.toLowerCase().replace(/\s+/g, '_');

      const { error } = await supabase
        .from('custom_tasks')
        .insert({
          user_id: session.user.id,
          title,
          time,
          task_type: taskType,
        });

      if (error) throw error;

      toast({
        title: "Task added successfully",
        description: "Your custom task has been created.",
      });
      
      onOpenChange(false);
      setTitle("");
      setTime("5 min");
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
            {/* Other tab contents will be similar but with different tasks */}
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}
