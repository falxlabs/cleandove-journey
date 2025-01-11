import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Settings, UserPlus, Share2, Flame, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

const Profile = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        setProfile(data);
      }
      setLoading(false);
    };
    getProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header with Settings */}
      <div className="relative h-48 bg-gradient-to-b from-muted/50 to-background">
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
        >
          <Settings className="h-6 w-6" />
        </Button>
        
        {/* Avatar */}
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
          <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
            <AvatarImage src={profile?.avatar_url} />
            <AvatarFallback className="text-2xl bg-muted">
              {profile?.username?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Profile Info */}
      <div className="mt-20 text-center space-y-2">
        <h1 className="text-2xl font-bold">{profile?.username || 'User'}</h1>
        <p className="text-sm text-muted-foreground">
          @{profile?.username?.toLowerCase() || 'user'} • Joined {profile?.created_at ? format(new Date(profile.created_at), 'MMMM yyyy') : ''}
        </p>
      </div>

      {/* Social Stats */}
      <div className="flex justify-center gap-8 mt-6">
        <div className="text-center">
          <div className="text-xl font-bold">0</div>
          <div className="text-sm text-muted-foreground">Following</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold">0</div>
          <div className="text-sm text-muted-foreground">Followers</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 mt-6 flex gap-2 justify-center">
        <Button 
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <UserPlus className="mr-2 h-5 w-5" />
          ADD FRIENDS
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10"
        >
          <Share2 className="h-5 w-5" />
        </Button>
      </div>

      {/* Overview Section */}
      <div className="px-4 mt-8">
        <h2 className="text-xl font-bold mb-4">Overview</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="h-6 w-6 text-orange-500" />
              <div>
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm text-muted-foreground">Day streak</div>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-yellow-500" />
              <div>
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm text-muted-foreground">Total XP</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;