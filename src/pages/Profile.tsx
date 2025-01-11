import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Gift, MessageSquare, Share2, Trophy, User, Users2 } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

const Profile = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (data) {
          setProfile(data);
        }
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 animate-fade-in">
      {/* Profile Cover */}
      <div className="h-32 bg-gradient-to-r from-primary/20 to-primary/10" />

      {/* Profile Info */}
      <div className="px-6 -mt-16">
        <div className="flex flex-col items-center">
          <Avatar className="h-32 w-32 border-4 border-background">
            <AvatarImage src={profile?.avatar_url} />
            <AvatarFallback className="bg-primary/10">
              <User className="h-12 w-12 text-primary" />
            </AvatarFallback>
          </Avatar>
          <h1 className="mt-4 text-2xl font-semibold">
            {profile?.username || "Anonymous User"}
          </h1>
          <p className="text-sm text-muted-foreground">
            Joined {format(new Date(profile?.created_at), "MMMM yyyy")}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
            <span className="text-2xl font-semibold">0</span>
            <span className="text-sm text-muted-foreground">Day Streak</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
            <span className="text-2xl font-semibold">0</span>
            <span className="text-sm text-muted-foreground">Total XP</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
            <span className="text-2xl font-semibold">0</span>
            <span className="text-sm text-muted-foreground">Achievements</span>
          </div>
        </div>

        {/* Social Stats */}
        <div className="mt-6 flex justify-center gap-8">
          <div className="flex flex-col items-center">
            <span className="text-lg font-semibold">0</span>
            <span className="text-sm text-muted-foreground">Following</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-lg font-semibold">0</span>
            <span className="text-sm text-muted-foreground">Followers</span>
          </div>
        </div>

        {/* Credits Section */}
        <div className="mt-8 p-4 bg-muted/50 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">Credits</span>
            <span className="text-sm text-muted-foreground">{profile?.credits || 0}/10</span>
          </div>
          <Progress value={(profile?.credits || 0) * 10} className="h-2" />
        </div>

        {/* Social Actions */}
        <div className="mt-8 space-y-4">
          <Button variant="outline" className="w-full justify-start gap-3">
            <Users2 className="h-5 w-5" />
            Find Friends
          </Button>
          <Button variant="outline" className="w-full justify-start gap-3">
            <Gift className="h-5 w-5" />
            Send a Gift
          </Button>
          <Button variant="outline" className="w-full justify-start gap-3">
            <Share2 className="h-5 w-5" />
            Share Profile
          </Button>
          <Button variant="outline" className="w-full justify-start gap-3">
            <Trophy className="h-5 w-5" />
            Achievements
          </Button>
          <Button variant="outline" className="w-full justify-start gap-3">
            <MessageSquare className="h-5 w-5" />
            Send Message
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;