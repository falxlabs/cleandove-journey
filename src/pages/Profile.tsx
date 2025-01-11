import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileStats from "@/components/profile/ProfileStats";
import ProfileOverview from "@/components/profile/ProfileOverview";
import ProfileAchievements from "@/components/profile/ProfileAchievements";

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
      <ProfileHeader profile={profile} />
      <div className="pt-4">
        <ProfileStats stats={mockStats} />
        <ProfileOverview stats={mockStats} />
        <ProfileAchievements achievements={mockAchievements} />
      </div>
    </div>
  );
};

export default Profile;