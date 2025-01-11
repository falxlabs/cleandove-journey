import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Flame, Users, Share2, Settings } from "lucide-react";
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
      <div className="relative h-48 bg-gradient-to-r from-[#243949] to-[#517fa4]">
        <Button 
          variant="ghost" 
          size="icon"
          className="absolute top-4 right-4 text-white hover:bg-white/20"
        >
          <Settings className="h-5 w-5" />
        </Button>
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
          <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
            <AvatarImage src={profile?.avatar_url} />
            <AvatarFallback className="text-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white">
              {profile?.username?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Profile Info */}
      <div className="mt-20 text-center space-y-2">
        <h1 className="text-2xl font-bold">{profile?.username || 'User'}</h1>
        <p className="text-sm text-muted-foreground">
          @{profile?.username?.toLowerCase() || 'username'} · Joined {profile?.created_at ? format(new Date(profile.created_at), 'MMMM yyyy') : ''}
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 gap-4 p-4 mt-6">
        <div className="bg-card rounded-lg p-6 text-center space-y-2 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-center">
            <Flame className="h-8 w-8 text-orange-500" />
          </div>
          <div className="text-3xl font-bold">0</div>
          <div className="text-sm text-muted-foreground">Day streak</div>
        </div>
        <div className="bg-card rounded-lg p-6 text-center space-y-2 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-center">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
              XP
            </div>
          </div>
          <div className="text-3xl font-bold">{profile?.credits || 0}</div>
          <div className="text-sm text-muted-foreground">Total XP</div>
        </div>
      </div>

      {/* Social Stats */}
      <div className="flex justify-center gap-12 mt-8 p-4 bg-card mx-4 rounded-lg shadow-sm">
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
      <div className="fixed bottom-20 right-4 flex flex-col gap-4">
        <Button 
          className="rounded-full shadow-lg hover:shadow-xl transition-shadow"
          size="icon"
        >
          <Share2 className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="px-4 mt-8">
        <Button 
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-md"
        >
          <Users className="mr-2 h-5 w-5" />
          Find Friends
        </Button>
      </div>
    </div>
  );
};

export default Profile;