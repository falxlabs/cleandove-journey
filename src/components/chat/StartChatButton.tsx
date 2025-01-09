import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StartChatButtonProps {
  onClick: () => void;
}

const StartChatButton = ({ onClick }: StartChatButtonProps) => {
  return (
    <Button
      onClick={onClick}
      className="w-full p-6 bg-primary text-primary-foreground hover:bg-primary/90"
    >
      <div className="flex justify-between items-center w-full">
        <span className="font-medium">Start New Chat</span>
        <ChevronRight className="h-5 w-5" />
      </div>
    </Button>
  );
};

export default StartChatButton;