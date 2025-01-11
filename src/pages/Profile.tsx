import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Settings, UserPlus, Share2, Flame, Zap, Trophy, Medal } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
      <div className="p-4 flex justify-end">
        <Button 
          variant="ghost" 
          size="icon"
          className="text-muted-foreground hover:text-foreground"
          onClick={() => navigate('/settings')}
        >
          <Settings className="h-6 w-6" />
        </Button>
      </div>
        
      {/* Avatar */}
      <div className="flex justify-center -mt-4">
        <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
          <AvatarImage src={profile?.avatar_url} />
          <AvatarFallback className="text-2xl bg-muted">
            {profile?.username?.[0]?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Profile Info */}
      <div className="mt-6 text-center space-y-2">
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
          className="bg-primary text-primary-foreground hover:bg-primary/90 w-[140px]"
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

      {/* Friend Streaks Section */}
      <div className="px-4 mt-8">
        <h2 className="text-xl font-bold mb-4">Friend Streaks</h2>
        <div className="bg-card rounded-xl p-6">
          <div className="flex justify-between items-center">
            {[1, 2, 3, 4, 5].map((_, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
                  <UserPlus className="h-5 w-5 text-muted-foreground/50" />
                </div>
                <span className="text-xs text-muted-foreground mt-2">0 days</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="px-4 mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Achievements</h2>
          <Button 
            variant="ghost" 
            className="text-sm text-primary hover:text-primary/90"
            onClick={() => navigate('/achievements')}
          >
            View All
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card rounded-xl p-4 flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Trophy className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="font-semibold">First Win</div>
              <div className="text-sm text-muted-foreground">Win your first game</div>
            </div>
          </div>
          <div className="bg-card rounded-xl p-4 flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Medal className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="font-semibold">Champion</div>
              <div className="text-sm text-muted-foreground">Reach level 10</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;