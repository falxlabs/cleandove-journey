import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

export const FriendsContent = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] space-y-6 px-4">
      <div className="relative">
        <img 
          src="/lovable-uploads/e7c74a34-018b-4a6a-8a64-0e45062d9ff8.png" 
          alt="Friends illustration" 
          className="w-48 h-48 object-contain"
        />
      </div>
      
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">
          Start <span className="text-[#00B2FF]">Friend Streaks</span> to make
        </h2>
        <p className="text-2xl font-semibold">daily progress together!</p>
      </div>

      <Button 
        className="w-full bg-[#00B2FF] hover:bg-[#00B2FF]/90 text-white font-medium py-6"
      >
        <UserPlus className="mr-2" />
        ADD FRIENDS
      </Button>
    </div>
  );
};