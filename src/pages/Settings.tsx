import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AccountSection from "@/components/settings/AccountSection";
import SubscriptionSection from "@/components/settings/SubscriptionSection";
import SupportSection from "@/components/settings/SupportSection";
import FooterLinks from "@/components/settings/FooterLinks";

const Settings = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const handleDone = () => {
    navigate(-1); // This will navigate back to the previous page
  };

  return (
    <div className="min-h-screen pb-20 bg-background">
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h1 className="text-xl font-semibold">Settings</h1>
        <Button variant="ghost" className="text-primary" onClick={handleDone}>
          Done
        </Button>
      </div>

      <AccountSection />
      <SubscriptionSection />
      <SupportSection />

      <div className="px-6 mt-8">
        <Button 
          variant="ghost" 
          className="w-full h-14 text-primary"
          onClick={handleSignOut}
        >
          SIGN OUT
        </Button>
      </div>

      <FooterLinks />
    </div>
  );
};

export default Settings;