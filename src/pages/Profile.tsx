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
    if (!session?.user?.id) {
      navigate('/auth');
      return;
    }

    const getProfile = async () => {
      try {
        setLoading(true);
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (!currentSession) {
          navigate('/auth');
          return;
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentSession.user.id)
          .single();
          
        if (error) {
          console.error('Error fetching profile:', error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load profile data. Please try again.",
          });
          return;
        }

        if (data) {
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
  }, [session?.user?.id, navigate, toast]);

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
      icon: "✨",
      color: "bg-purple-500",
      title: "Perfect Week",
      progress: "5 of 7 days",
    },
    {
      icon: "📝",
      color: "bg-green-500",
      title: "Task Master",
      progress: "15 of 20 tasks",
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