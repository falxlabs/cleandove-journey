import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Settings, UserPlus, Share2, Trophy, Award, Flame } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";

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
        <Card className="p-6">
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
          <div className="mt-6 grid grid-cols-2 gap-4">
            <Card className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm text-muted-foreground">Following</div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm text-muted-foreground">Followers</div>
              </div>
            </Card>
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
        </Card>
      </div>

      {/* Overview Section */}
      <div className="px-6 mt-8">
        <div className="flex items-center gap-3 mb-6">
          <Trophy className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Overview</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Flame className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm text-muted-foreground">Day streak</div>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm text-muted-foreground">Total XP</div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Achievements Preview */}
      <div className="px-6 mt-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Award className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Achievements</h2>
          </div>
          <Button 
            variant="ghost" 
            className="text-primary hover:text-primary/90 font-medium"
            onClick={() => navigate('/achievements')}
          >
            View All
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-pink-500 flex items-center justify-center text-3xl mb-3">
                🏃‍♂️
              </div>
              <div className="font-semibold mb-1">XP Olympian</div>
              <div className="text-sm text-muted-foreground">3 of 10</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-green-500 flex items-center justify-center text-3xl mb-3">
                🎯
              </div>
              <div className="font-semibold mb-1">Flawless Finisher</div>
              <div className="text-sm text-muted-foreground">2 of 5</div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;