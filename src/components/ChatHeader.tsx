import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface ChatHeaderProps {
  topic?: string;
  title?: string;
}

export const ChatHeader = ({ topic, title }: ChatHeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleBack = () => {
    // Get the previous route from state, default to /chat if not specified
    const previousRoute = location.state?.from || "/chat";
    navigate(previousRoute);
  };

  return (
    <div className="flex items-center gap-2 px-4 py-3 border-b">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleBack}
        className="mr-2"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
      <Avatar className="h-8 w-8">
        <AvatarFallback>
          <div className="rounded-full bg-muted p-3 flex items-center justify-center">
            <span className="text-lg">🕊️</span>
          </div>
        </AvatarFallback>
      </Avatar>
      <div>
        <h2 className="font-semibold">Pace</h2>
        <p className="text-sm text-muted-foreground">
          {topic ? `Chat about ${topic}` : title || "New Chat"}
        </p>
      </div>
    </div>
  );
};