import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import ProfileStats from "@/components/profile/ProfileStats";
import ProfileOverview from "@/components/profile/ProfileOverview";
import ProfileAchievements from "@/components/profile/ProfileAchievements";
import StickyHeader from "@/components/StickyHeader";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
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

  const settingsButton = (
    <Button 
      variant="ghost" 
      size="icon"
      className="text-muted-foreground hover:text-foreground"
      onClick={() => navigate('/settings')}
    >
      <Settings className="h-5 w-5" />
    </Button>
  );

  const mockStats = {
    following: 0,
    followers: 0,
    streak: 0,
    xp: 0,
  };

  const mockAchievements = [
    {
      icon: "🏃‍♂️",
      color: "bg-pink-500",
      title: "XP Olympian",
      progress: "3 of 10",
    },
    {
      icon: "🎯",
      color: "bg-green-500",
      title: "Flawless Finisher",
      progress: "2 of 5",
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <StickyHeader
        title="Profile"
        rightElement={settingsButton}
      />
      <div className="px-6">
        <div className="p-6">
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
                @{profile?.username?.toLowerCase() || 'user'}
              </p>
            </div>
          </div>

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
      <ProfileStats stats={mockStats} />
      <ProfileOverview stats={mockStats} />
      <ProfileAchievements achievements={mockAchievements} />
    </div>
  );
};

export default Profile;
