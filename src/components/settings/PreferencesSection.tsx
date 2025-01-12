import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChristFocusedToggle } from "./ChristFocusedToggle";
import { ContentTypePreference } from "./ContentTypePreference";
import { useSession } from "@supabase/auth-helpers-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

const PreferencesSection = () => {
  const navigate = useNavigate();
  const session = useSession();

  useEffect(() => {
    if (session === null) {
      navigate('/auth', { replace: true });
    }
  }, [session, navigate]);

  if (session === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (session === undefined) {
    return (
      <div className="min-h-screen bg-background p-6">
        <Alert variant="destructive">
          <AlertDescription>
            Unable to verify authentication status. Please try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 z-10 bg-background border-b shadow-sm">
        <div className="px-6 py-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Preferences</h1>
            <Button 
              variant="ghost" 
              className="text-primary"
              onClick={() => navigate("/settings")}
            >
              Done
            </Button>
          </div>
        </div>
      </div>

      <div className="px-6 mt-8">
        <div className="space-y-6 bg-card rounded-lg p-6 shadow-sm">
          <ChristFocusedToggle />
          <div className="border-t pt-6">
            <ContentTypePreference />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreferencesSection;