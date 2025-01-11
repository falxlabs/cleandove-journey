import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SettingsButton = () => {
  const navigate = useNavigate();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => navigate("/settings")}
      className="hover:bg-muted"
    >
      <Settings className="h-5 w-5" />
    </Button>
  );
};

export default SettingsButton;