import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

export const FriendsContent = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 animate-fade-in">
      <img
        src="/lovable-uploads/52ac0b5d-d1b9-4aba-911c-c646e26050ce.png"
        alt="Friends illustration"
        className="w-48 h-48 mb-6"
      />
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