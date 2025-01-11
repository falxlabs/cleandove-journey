import { Button } from "@/components/ui/button";
import SettingsButton from "./SettingsButton";

const SupportSection = () => {
  return (
    <div className="px-6 mt-8">
      <h2 className="text-xl font-semibold mb-4">Support</h2>
      <div className="space-y-px bg-card rounded-lg overflow-hidden shadow-sm">
        <SettingsButton label="Help Center" />
        <SettingsButton label="Feedback" />
      </div>
    </div>
  );
};

export default SupportSection;