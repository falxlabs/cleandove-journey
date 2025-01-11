import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  User, 
  Users, 
  Trophy,
  Flame,
  Gift,
  Crown,
  Calendar
} from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { format } from "date-fns"

const Profile = () => {
  const [credits, setCredits] = useState<number>(0)
  const [username, setUsername] = useState<string>("")
  const [joinDate, setJoinDate] = useState<string>("")
  const MAX_CREDITS = 10

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user?.id) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle()
        
        if (profile) {
          setCredits(profile.credits)
          setUsername(profile.username || "User")
          setJoinDate(format(new Date(profile.created_at), 'MMMM yyyy'))
        }
      }
    }

    fetchProfile()
  }, [])

  return (
    <div className="min-h-screen pb-20 animate-fade-in">
      {/* Profile Header */}
      <div className="relative">
        <div className="h-32 bg-gradient-to-r from-primary/20 to-primary/10" />
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
          <Avatar className="h-32 w-32 border-4 border-background">
            <AvatarImage src="" />
            <AvatarFallback className="bg-primary/10">
              <User className="h-16 w-16 text-primary" />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Profile Info */}
      <div className="mt-20 px-6 space-y-8">
        {/* Username and Join Date */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">{username}</h1>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Joined {joinDate}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center p-4 rounded-lg bg-secondary/20">
            <Flame className="h-6 w-6 text-orange-500 mb-2" />
            <span className="text-xl font-bold">0</span>
            <span className="text-xs text-muted-foreground">Day Streak</span>
          </div>
          <div className="flex flex-col items-center p-4 rounded-lg bg-secondary/20">
            <Crown className="h-6 w-6 text-yellow-500 mb-2" />
            <span className="text-xl font-bold">0</span>
            <span className="text-xs text-muted-foreground">Total XP</span>
          </div>
          <div className="flex flex-col items-center p-4 rounded-lg bg-secondary/20">
            <Trophy className="h-6 w-6 text-blue-500 mb-2" />
            <span className="text-xl font-bold">0</span>
            <span className="text-xs text-muted-foreground">Achievements</span>
          </div>
        </div>

        {/* Social Stats */}
        <div className="flex justify-center gap-8">
          <button className="flex flex-col items-center">
            <span className="text-lg font-bold">0</span>
            <span className="text-sm text-muted-foreground">Following</span>
          </button>
          <button className="flex flex-col items-center">
            <span className="text-lg font-bold">0</span>
            <span className="text-sm text-muted-foreground">Followers</span>
          </button>
        </div>

        {/* Credits Section */}
        <div className="space-y-3 bg-secondary/20 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-primary" />
              <span className="font-medium">Credits</span>
            </div>
            <span className="text-sm font-medium">{credits}/{MAX_CREDITS}</span>
          </div>
          <Progress value={(credits / MAX_CREDITS) * 100} className="h-2" />
          <p className="text-xs text-muted-foreground">
            Credits are used for AI-powered features
          </p>
        </div>

        {/* Social Actions */}
        <div className="space-y-3">
          <Button className="w-full" variant="outline">
            <Users className="mr-2 h-4 w-4" />
            Find Friends
          </Button>
          <Button className="w-full" variant="outline">
            <Gift className="mr-2 h-4 w-4" />
            Send Gift
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Profile