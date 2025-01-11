import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Settings, UserPlus, Share2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Link } from "react-router-dom";

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
    <div className="min-h-screen bg-[#0C1018] text-white pb-20">
      {/* Settings Button */}
      <div className="absolute top-4 right-4">
        <Link to="/settings">
          <Button variant="ghost" size="icon" className="text-white hover:text-white/80">
            <Settings className="h-6 w-6" />
          </Button>
        </Link>
      </div>

      {/* Profile Header */}
      <div className="relative h-48 bg-gradient-to-b from-[#1A1F2C] to-[#0C1018]">
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
          <Avatar className="h-32 w-32 border-4 border-[#0C1018] bg-[#1A1F2C]">
            <AvatarImage src={profile?.avatar_url} />
            <AvatarFallback className="text-4xl bg-[#1A1F2C] text-[#4B9EE8]">
              {profile?.username?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Profile Info */}
      <div className="mt-20 text-center space-y-2">
        <h1 className="text-2xl font-bold">{profile?.username || 'User'}</h1>
        <p className="text-sm text-gray-400">
          @{profile?.username?.toLowerCase()}402343 • Joined {profile?.created_at ? format(new Date(profile.created_at), 'MMMM yyyy') : ''}
        </p>
      </div>

      {/* Social Stats */}
      <div className="flex justify-center gap-12 mt-8">
        <div className="text-center">
          <div className="text-xl font-bold">0</div>
          <div className="text-sm text-gray-400">Following</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold">0</div>
          <div className="text-sm text-gray-400">Followers</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 mt-6 space-y-4">
        <Button 
          className="w-full bg-transparent border-2 border-[#4B9EE8] hover:bg-[#4B9EE8]/10 text-[#4B9EE8]"
        >
          <UserPlus className="mr-2 h-5 w-5" />
          ADD FRIENDS
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="absolute bottom-4 right-4 rounded-xl bg-transparent border-2 border-[#4B9EE8] hover:bg-[#4B9EE8]/10 text-[#4B9EE8]"
        >
          <Share2 className="h-5 w-5" />
        </Button>
      </div>

      {/* Overview Section */}
      <div className="px-4 mt-8">
        <h2 className="text-2xl font-bold mb-4">Overview</h2>
        <div className="bg-[#1A1F2C] rounded-2xl p-4">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Day Streak</h3>
              <p className="text-3xl font-bold">0</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Total XP</h3>
              <p className="text-3xl font-bold text-[#4B9EE8]">{profile?.credits || 0}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;