import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Settings, UserPlus, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProfileHeaderProps {
  profile: any;
}

const ProfileHeader = ({ profile }: ProfileHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="divide-y">
      <div className="sticky top-0 z-10 bg-background flex items-center justify-between px-6 py-4 border-b shadow-sm">
        <h1 className="text-xl font-semibold">Profile</h1>
        <Button 
          variant="ghost" 
          size="icon"
          className="text-muted-foreground hover:text-foreground"
          onClick={() => navigate('/settings')}
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>
        
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
    </div>
  );
};

export default ProfileHeader;