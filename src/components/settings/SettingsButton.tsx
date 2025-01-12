import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { ReactNode } from "react";

interface SettingsButtonProps {
  label: string;
  onClick?: () => void;
  className?: string;
  icon?: ReactNode;
}

const SettingsButton = ({ label, onClick, className, icon }: SettingsButtonProps) => {
  return (
    <Button
      variant="ghost"
      className={`w-full justify-between h-14 px-4 ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span>{label}</span>
      </div>
      <ArrowRight className="h-5 w-5 text-muted-foreground" />
    </Button>
  );
};

export default SettingsButton;