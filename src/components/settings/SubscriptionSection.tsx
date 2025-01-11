import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import SettingsButton from "./SettingsButton";
import { useCredits } from "@/hooks/useCredits";

const SubscriptionSection = () => {
  const { credits, MAX_CREDITS } = useCredits();

  return (
    <div className="px-6 mt-8">
      <h2 className="text-xl font-semibold mb-4">Subscription</h2>
      <div className="space-y-4">
        <div className="py-6 space-y-3 bg-card rounded-lg shadow-sm px-4">
          <div className="flex justify-between items-center">
            <span className="text-sm">Daily Messages Remaining</span>
            <span className="font-semibold">{credits}/{MAX_CREDITS}</span>
          </div>
          <Progress value={(credits / MAX_CREDITS) * 100} className="h-2" />
        </div>

        <div className="bg-card rounded-lg overflow-hidden shadow-sm">
          <SettingsButton label="Choose a plan" />
          <SettingsButton label="Redeem code" />
        </div>

        <Button variant="ghost" className="w-full h-14 text-primary">
          RESTORE SUBSCRIPTION
        </Button>
      </div>
    </div>
  );
};

export default SubscriptionSection;