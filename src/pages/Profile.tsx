import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Flame, Zap, Trophy, Users, Share2 } from "lucide-react";
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
    <div className="min-h-screen pb-20">
      {/* Profile Header */}
      <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-500">
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
          <Avatar className="h-32 w-32 border-4 border-background">
            <AvatarImage src={profile?.avatar_url} />
            <AvatarFallback className="text-2xl">{profile?.username?.[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Profile Info */}
      <div className="mt-20 text-center space-y-2">
        <h1 className="text-2xl font-bold">{profile?.username || 'User'}</h1>
        <p className="text-sm text-muted-foreground">
          Joined {profile?.created_at ? format(new Date(profile.created_at), 'MMMM yyyy') : ''}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 p-4 mt-6">
        <div className="bg-card rounded-lg p-4 text-center space-y-1">
          <div className="flex justify-center">
            <Flame className="h-6 w-6 text-orange-500" />
          </div>
          <div className="text-2xl font-bold">0</div>
          <div className="text-sm text-muted-foreground">Day streak</div>
        </div>
        <div className="bg-card rounded-lg p-4 text-center space-y-1">
          <div className="flex justify-center">
            <Zap className="h-6 w-6 text-yellow-500" />
          </div>
          <div className="text-2xl font-bold">{profile?.credits || 0}</div>
          <div className="text-sm text-muted-foreground">Total XP</div>
        </div>
      </div>

      {/* Credits Progress */}
      <div className="p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span>Credits</span>
          <span>{profile?.credits || 0}/100</span>
        </div>
        <Progress value={(profile?.credits || 0)} max={100} className="h-2" />
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
      <div className="flex gap-4 p-4 mt-4">
        <Button className="flex-1" variant="outline">
          <Users className="mr-2" />
          Find Friends
        </Button>
        <Button variant="outline" size="icon">
          <Share2 />
        </Button>
      </div>
    </div>
  );
};

export default Profile;