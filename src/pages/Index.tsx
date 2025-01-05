import { ShieldCheck, Flame } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { format, getDaysInMonth, startOfMonth, getDay } from "date-fns";

const Index = () => {
  const currentStreak = 3;
  const today = new Date();
  const daysInMonth = getDaysInMonth(today);
  const monthStart = startOfMonth(today);
  const startDay = getDay(monthStart);
  
  // Generate calendar days
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  
  // Add empty slots for proper day alignment
  const emptyDays = Array.from({ length: startDay }, (_, i) => null);
  const allDays = [...emptyDays, ...calendarDays];

  return (
    <div className="min-h-screen pb-20 animate-fade-in">
      <header className="px-6 py-8 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Today's Quest</h1>
          <Button variant="ghost" size="icon" className="px-4 pr-6 gap-0.5">
            <Flame className="h-5 w-5 text-orange-500" />
            <span className="text-sm text-muted-foreground">{currentStreak}</span>
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div className="flex-1 flex items-center bg-muted rounded-lg px-4 py-2">
            <p className="text-sm text-muted-foreground">Keep going strong! Your daily spiritual journey continues to inspire.</p>
          </div>
        </div>
      </header>

      <section className="px-6 mb-8">
        <h2 className="text-xl font-medium mb-4">{format(today, 'MMMM yyyy')}</h2>
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
            <div key={day} className="text-center text-sm text-muted-foreground">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {allDays.map((day, index) => (
            <div key={index} className="aspect-square">
              {day && (
                <div
                  className={`w-full h-full rounded-full flex items-center justify-center text-sm
                    ${day <= currentStreak 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-secondary text-secondary-foreground'
                    }
                    ${day === today.getDate() ? 'ring-2 ring-primary' : ''}
                  `}
                >
                  {day}
                </div>
              )}
            </div>
          ))}
        </div>
        <Progress value={43} className="h-2 mt-6" />
        <p className="text-sm text-muted-foreground mt-2">43% completed today</p>
      </section>

      <section className="px-6 space-y-4">
        {[
          { title: "Morning Reflection", time: "5 min", completed: false },
          { title: "Daily Scripture", time: "10 min", completed: true },
          { title: "Evening Check-in", time: "5 min", completed: false },
        ].map((task) => (
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
      </section>
    </div>
  );
};

export default Index;