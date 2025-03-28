import { useNavigate } from "react-router-dom";
import SettingsButton from "./SettingsButton";

const AccountSection = () => {
  const navigate = useNavigate();

  return (
    <div className="px-6 mt-8">
      <h2 className="text-xl font-semibold mb-4">Account</h2>
      <div className="space-y-px bg-card rounded-lg overflow-hidden shadow-sm">
        <SettingsButton 
          label="Preferences" 
          onClick={() => navigate("/settings/preferences")}
        />
        <SettingsButton label="Profile" />
        <SettingsButton label="Notifications" />
        <SettingsButton label="Social accounts" />
        <SettingsButton label="Privacy settings" />
      </div>
    </div>
  );
};

export default AccountSection;