import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface SettingsButtonProps {
  label: string;
  onClick?: () => void;
  className?: string;
}

const SettingsButton = ({ label, onClick, className }: SettingsButtonProps) => {
  return (
    <Button
      variant="ghost"
      className={`w-full justify-between h-14 px-4 ${className}`}
      onClick={onClick}
    >
      <span>{label}</span>
      <ArrowRight className="h-5 w-5 text-muted-foreground" />
    </Button>
  );
};

export default SettingsButton;