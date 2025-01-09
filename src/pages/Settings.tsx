import { useQuery } from "@tanstack/react-query";
import PageHeader from "@/components/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";

const Settings = () => {
  const { data: profile, isLoading } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      return profile;
    },
  });

  return (
    <div className="min-h-screen pb-20 animate-fade-in">
      <PageHeader
        title="Settings"
        emoji="⚙️"
        description="Customize your experience"
      />

      <div className="px-6 space-y-6">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-card rounded-lg border">
              <h3 className="font-medium mb-2">Profile</h3>
              <p className="text-sm text-muted-foreground">
                {profile?.username || "No username set"}
              </p>
            </div>
            <div className="p-4 bg-card rounded-lg border">
              <h3 className="font-medium mb-2">Notifications</h3>
              <p className="text-sm text-muted-foreground">
                Manage your notification preferences
              </p>
            </div>
            <div className="p-4 bg-card rounded-lg border">
              <h3 className="font-medium mb-2">Privacy</h3>
              <p className="text-sm text-muted-foreground">
                Control your privacy settings
              </p>
            </div>
            <div className="p-4 bg-card rounded-lg border">
              <h3 className="font-medium mb-2">Language</h3>
              <p className="text-sm text-muted-foreground">
                Choose your preferred language
              </p>
            </div>
            <div className="p-4 bg-card rounded-lg border">
              <h3 className="font-medium mb-2">Theme</h3>
              <p className="text-sm text-muted-foreground">
                Customize the app appearance
              </p>
            </div>
            <div className="p-4 bg-card rounded-lg border">
              <h3 className="font-medium mb-2">Account</h3>
              <p className="text-sm text-muted-foreground">
                Manage your account settings
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;