import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CreditCard, Loader2 } from "lucide-react";
import SettingsButton from "./SettingsButton";
import { useCredits } from "@/hooks/useCredits";
import { useSubscriptionDetails } from "@/hooks/useSubscriptionDetails";

const SubscriptionSection = () => {
  const { credits } = useCredits();
  const { planDetails, isLoading } = useSubscriptionDetails();

  if (isLoading || !planDetails) {
    return (
      <div className="px-6 mt-8">
        <h2 className="text-xl font-semibold mb-4">Subscription</h2>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  const progressValue = (credits / planDetails.daily_credits) * 100;

  return (
    <div className="px-6 mt-8">
      <h2 className="text-xl font-semibold mb-4">Subscription</h2>
      <div className="space-y-4">
        <div className="py-6 space-y-3 bg-card rounded-lg shadow-sm px-4">
          <div className="flex justify-between items-center">
            <span className="text-sm">Daily Messages Remaining</span>
            <span className="font-semibold">{credits}/{planDetails.daily_credits}</span>
          </div>
          <Progress value={progressValue} className="h-2" />
          <p className="text-sm text-muted-foreground">{planDetails.description}</p>
        </div>

        <div className="bg-card rounded-lg overflow-hidden shadow-sm">
          <SettingsButton 
            label="Choose a plan" 
            icon={<CreditCard className="h-5 w-5 text-muted-foreground" />}
          />
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