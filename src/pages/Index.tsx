import { Calendar } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const Index = () => {
  const weekDays = ["M", "T", "W", "T", "F", "S", "S"];
  const currentStreak = 3; // Example streak

  return (
    <div className="min-h-screen pb-20 animate-fade-in">
      <header className="px-6 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
              <span className="text-2xl">🕊️</span>
            </div>
            <div className="flex items-center bg-muted rounded-lg px-4 py-2">
              <p className="text-sm text-muted-foreground">Keep going strong!</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-muted rounded-lg px-4 py-2">
            <span className="text-xl">🔥</span>
            <span className="font-medium">{currentStreak}</span>
          </div>
        </div>
      </header>

      <section className="px-6 mb-8">
        <div className="flex justify-between mb-4">
          {weekDays.map((day, index) => (
            <div
              key={day}
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                index < currentStreak
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              {day}
            </div>
          ))}
        </div>
        <Progress value={43} className="h-2" />
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