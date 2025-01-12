import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface DailyHeaderProps {
  streak: number | undefined;
  isStreakLoading: boolean;
}

const DailyHeader = ({ streak, isStreakLoading }: DailyHeaderProps) => {
  const navigate = useNavigate();

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['profile-pearls'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('pearls')
        .eq('id', user.id)
        .single();
        
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Today's Quest</h1>
        <div className="flex items-center gap-2">
          {isProfileLoading ? (
            <Skeleton className="h-10 w-20" />
          ) : (
            <Button 
              variant="ghost" 
              size="icon" 
              className="px-4 pr-6 gap-0.5"
            >
              <span className="text-xl">🦪</span>
              <span className="text-sm text-muted-foreground">{profile?.pearls || 0}</span>
            </Button>
          )}
          {isStreakLoading ? (
            <Skeleton className="h-10 w-20" />
          ) : (
            <Button 
              variant="ghost" 
              size="icon" 
              className="px-4 pr-6 gap-0.5"
              onClick={() => navigate('/streak')}
            >
              <span className="text-xl">🔥</span>
              <span className="text-sm text-muted-foreground">{streak}</span>
            </Button>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
          <span className="text-2xl">🕊️</span>
        </div>
        <div className="flex-1 flex items-center bg-muted rounded-lg px-4 py-2">
          <p className="text-sm text-muted-foreground">Keep going strong! Your daily journey continues to inspire.</p>
        </div>
      </div>
    </div>
  );
};

export default DailyHeader;