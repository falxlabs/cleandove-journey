import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import AccountSection from "@/components/settings/AccountSection";
import SubscriptionSection from "@/components/settings/SubscriptionSection";
import SupportSection from "@/components/settings/SupportSection";
import FooterLinks from "@/components/settings/FooterLinks";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@supabase/auth-helpers-react";

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const session = useSession();

  useEffect(() => {
    if (session === null) {
      navigate('/auth', { replace: true });
    }
  }, [session, navigate]);

  const handleSignOut = async () => {
    try {
      // First clear any cached data
      localStorage.clear();
      sessionStorage.clear();
      
      // Then sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      
      // Navigate to auth page after successful signout
      navigate('/auth', { replace: true });
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: "Please try again"
      });
    }
  };

  if (session === null) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 z-10 bg-background border-b shadow-sm">
        <div className="px-6 py-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Settings</h1>
            <Button 
              variant="ghost" 
              className="text-primary"
              onClick={() => navigate("/profile")}
            >
              Done
            </Button>
          </div>
        </div>
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