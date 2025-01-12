import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AccountSection from "@/components/settings/AccountSection";
import SubscriptionSection from "@/components/settings/SubscriptionSection";
import SupportSection from "@/components/settings/SupportSection";
import FooterLinks from "@/components/settings/FooterLinks";
import { useToast } from "@/hooks/use-toast";
import { AuthError } from "@supabase/supabase-js";

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      // First check if we have a session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        navigate('/auth', { replace: true });
        return;
      }

      if (!session) {
        // No session found, redirect to auth
        navigate('/auth', { replace: true });
        return;
      }

      // Attempt to sign out
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        // If we get a 403 or session not found, just redirect to auth
        if (error.status === 403 || (error as AuthError).message.includes('session')) {
          navigate('/auth', { replace: true });
          return;
        }
        
        toast({
          variant: "destructive",
          title: "Error signing out",
          description: "Please try again"
        });
        return;
      }

      // If successful, navigate to auth page
      navigate('/auth', { replace: true });
      
    } catch (error) {
      console.error('Unexpected error during logout:', error);
      // Even if there's an error, we should try to redirect to auth
      // since the session is likely invalid
      navigate('/auth', { replace: true });
    }
  };

  const handleDone = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 z-10 bg-background border-b shadow-sm">
        <div className="px-6 py-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Settings</h1>
            <Button 
              variant="ghost" 
              className="text-primary"
              onClick={handleDone}
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