import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Settings, UserPlus, Share2, Trophy, Award, Flame } from "lucide-react";
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
      {/* Header Section */}
      <header className="px-6 py-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Profile</h1>
          <Button 
            variant="ghost" 
            size="icon"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => navigate('/settings')}
          >
            <Settings className="h-6 w-6" />
          </Button>
        </div>
      </header>
        
      {/* Profile Section */}
      <div className="px-6">
        <div className="bg-card rounded-xl p-6 shadow-sm">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
              <AvatarImage src={profile?.avatar_url} />
              <AvatarFallback className="text-2xl bg-muted">
                {profile?.username?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="text-center space-y-1">
              <h2 className="text-xl font-semibold">{profile?.username || 'User'}</h2>
              <p className="text-sm text-muted-foreground">
                @{profile?.username?.toLowerCase() || 'user'} • Joined {profile?.created_at ? format(new Date(profile.created_at), 'MMMM yyyy') : ''}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-2 gap-4 text-center">
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="text-2xl font-bold">0</div>
              <div className="text-sm text-muted-foreground">Following</div>
            </div>
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="text-2xl font-bold">0</div>
              <div className="text-sm text-muted-foreground">Followers</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex gap-2 justify-center">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <UserPlus className="mr-2 h-5 w-5" />
              Add Friends
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Overview Section */}
      <div className="px-6 mt-8">
        <div className="flex items-center gap-3 mb-4">
          <Trophy className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-semibold">Overview</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Flame className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm text-muted-foreground">Day streak</div>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Award className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm text-muted-foreground">Total XP</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements Preview */}
      <div className="px-6 mt-8">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <Award className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">Achievements</h2>
          </div>
          <Button 
            variant="ghost" 
            className="text-sm text-primary hover:text-primary/90"
            onClick={() => navigate('/achievements')}
          >
            View All
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Trophy className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="font-semibold">First Win</div>
                <div className="text-sm text-muted-foreground">Win your first game</div>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Award className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="font-semibold">Champion</div>
                <div className="text-sm text-muted-foreground">Reach level 10</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
