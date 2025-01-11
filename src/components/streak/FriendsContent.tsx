import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

export const FriendsContent = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 animate-fade-in">
      <h2 className="text-2xl font-semibold text-center mb-2">
        Start <span className="text-primary">Friend Streaks</span> to make
      </h2>
      <p className="text-2xl font-semibold text-center mb-8">
        daily progress together!
      </p>
      <Button className="w-full max-w-md" size="lg">
        <UserPlus className="mr-2" />
        ADD FRIENDS
      </Button>
    </div>
  );
};