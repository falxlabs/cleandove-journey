import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, Share2, ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "@/components/ui/calendar";

const Streak = () => {
  const [activeTab, setActiveTab] = useState<"personal" | "friends">("personal");
  const [date, setDate] = useState<Date>(new Date());
  const currentMonth = date.toLocaleString('default', { month: 'long' });
  const currentYear = date.getFullYear();

  const { data: streakData, isLoading: isStreakLoading } = useQuery({
    queryKey: ['streak-data'],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        currentStreak: 0,
        daysCompleted: 0,
      };
    },
  });

  const onPreviousMonth = () => {
    const newDate = new Date(date);
    newDate.setMonth(date.getMonth() - 1);
    setDate(newDate);
  };

  const onNextMonth = () => {
    const newDate = new Date(date);
    newDate.setMonth(date.getMonth() + 1);
    setDate(newDate);
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <X className="w-6 h-6" />
        <h1 className="text-2xl font-semibold">Streak</h1>
        <Share2 className="w-6 h-6" />
      </div>

      {/* Tabs */}
      <div className="flex mb-8 border-b">
        <button
          className={`flex-1 pb-2 text-lg font-medium ${
            activeTab === "personal"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground"
          }`}
          onClick={() => setActiveTab("personal")}
        >
          PERSONAL
        </button>
        <button
          className={`flex-1 pb-2 text-lg font-medium ${
            activeTab === "friends"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground"
          }`}
          onClick={() => setActiveTab("friends")}
        >
          FRIENDS
        </button>
      </div>

      {/* Streak Display */}
      <div className="text-center mb-8">
        {isStreakLoading ? (
          <Skeleton className="h-24 w-24 rounded-full mx-auto mb-4" />
        ) : (
          <>
            <div className="text-8xl font-bold mb-2">{streakData?.currentStreak}</div>
            <div className="text-xl text-muted-foreground">day streak!</div>
          </>
        )}
      </div>

      {/* Perfect Streak Card */}
      <Card className="mb-8 bg-card/50 backdrop-blur">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 flex items-center justify-center bg-primary/10 rounded-full">
              <span className="text-2xl">🔥</span>
            </div>
            <div className="flex-1">
              <p className="text-sm">
                Do a lesson every day this week to earn this{" "}
                <span className="text-primary font-medium">Perfect Streak</span> flame!
              </p>
            </div>
          </div>
          <Button className="w-full mt-4" variant="secondary">
            EXTEND STREAK
          </Button>
        </CardContent>
      </Card>

      {/* Streak Challenge */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Streak Challenge</h2>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 flex items-center justify-center bg-primary/10 rounded-full">
              <span className="text-2xl">📅</span>
            </div>
            <p className="flex-1">Earn gems by keeping your streak alive!</p>
          </div>
          <Button className="w-full">JOIN CHALLENGE</Button>
        </CardContent>
      </Card>

      {/* Monthly Stats with Calendar */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <button onClick={onPreviousMonth}>
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-semibold">
              {currentMonth} {currentYear}
            </h2>
            <button onClick={onNextMonth}>
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          <div className="grid gap-4">
            <div className="text-center p-4 bg-secondary rounded-lg">
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl">✓</span>
                <span className="text-2xl font-bold">{streakData?.daysCompleted}</span>
              </div>
              <p className="text-sm text-muted-foreground">Days practiced</p>
            </div>
            
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => newDate && setDate(newDate)}
              className="rounded-md border"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Streak;