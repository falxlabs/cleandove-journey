import { Calendar } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const Index = () => {
  const weekDays = ["M", "T", "W", "T", "F", "S", "S"];
  const currentStreak = 3; // Example streak

  return (
    <div className="min-h-screen pb-20 animate-fade-in">
      <header className="px-6 py-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Today's Journey</h1>
          <p className="text-muted-foreground mt-1">Keep going strong!</p>
        </div>
        <button className="p-2 hover:bg-secondary rounded-full transition-colors">
          <Calendar className="h-6 w-6" />
        </button>
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