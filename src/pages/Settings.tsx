import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AccountSection from "@/components/settings/AccountSection";
import SubscriptionSection from "@/components/settings/SubscriptionSection";
import SupportSection from "@/components/settings/SupportSection";
import FooterLinks from "@/components/settings/FooterLinks";
import { useToast } from "@/components/ui/use-toast";
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
        // If we can't get the session, just redirect to auth
        navigate('/auth');
        return;
      }

      if (!session) {
        // If no session, just redirect to auth
        navigate('/auth');
        return;
      }

      // Attempt to sign out
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Logout error:', error);
        // Check if it's an AuthError and handle accordingly
        const message = error instanceof AuthError 
          ? error.message
          : "Please try again later";
          
        toast({
          variant: "destructive",
          title: "Error signing out",
          description: message,
        });
        return;
      }

      // Only navigate after successful logout
      navigate('/auth');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: "An unexpected error occurred. Please try again later",
      });
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