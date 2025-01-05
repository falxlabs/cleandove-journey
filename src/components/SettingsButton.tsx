import { Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const SettingsButton = () => {
  return (
    <Link to="/settings">
      <Button variant="ghost" size="icon">
        <Settings className="h-5 w-5" />
      </Button>
    </Link>
  );
};

export default SettingsButton;