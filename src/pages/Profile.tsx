import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileStats from "@/components/profile/ProfileStats";
import ProfileOverview from "@/components/profile/ProfileOverview";
import ProfileAchievements from "@/components/profile/ProfileAchievements";

const Profile = () => {
  const session = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect if not authenticated
    if (!session) {
      navigate('/auth');
      return;
    }

    const getProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (error) {
          console.error('Error fetching profile:', error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load profile data. Please try again.",
          });
        } else {
          setProfile(data);
        }
      } catch (error) {
        console.error('Error:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "An unexpected error occurred.",
        });
      } finally {
        setLoading(false);
      }
    };
    
    getProfile();
  }, [session, navigate, toast]);

  if (!session) {
    return null;
  }

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
      <ProfileStats stats={mockStats} />
      <ProfileOverview stats={mockStats} />
      <ProfileAchievements achievements={mockAchievements} />
    </div>
  );
};

export default Profile;