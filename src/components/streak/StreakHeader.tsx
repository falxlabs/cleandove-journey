import { X, Share2 } from "lucide-react";

export const StreakHeader = () => {
  return (
    <div className="flex justify-between items-center mb-8">
      <X className="w-6 h-6" />
      <h1 className="text-2xl font-semibold">Streak</h1>
      <Share2 className="w-6 h-6" />
    </div>
  );
};