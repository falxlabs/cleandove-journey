import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, User, UserPlus, Users, Calendar, CreditCard } from "lucide-react"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"

const Profile = () => {
  const [credits, setCredits] = useState<number>(0)
  const [username, setUsername] = useState<string>("")
  const [joinedDate, setJoinedDate] = useState<string>("")
  const MAX_CREDITS = 10

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user?.id) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('credits, username, created_at')
          .eq('id', session.user.id)
          .single()
        
        if (profile) {
          setCredits(profile.credits)
          setUsername(profile.username || 'User')
          setJoinedDate(new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }))
        }
      }
    }

    fetchUserData()
  }, [])

  return (
    <div className="min-h-screen pb-20 animate-fade-in bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      {/* Profile Header */}
      <div className="relative">
        <div className="h-32 bg-primary/10" />
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
          <Avatar className="h-24 w-24 border-4 border-background">
            <AvatarImage src="" />
            <AvatarFallback className="bg-primary/10">
              <User className="h-12 w-12 text-primary" />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Profile Info */}
      <div className="mt-16 px-6 space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold">{username}</h1>
          <p className="text-sm text-muted-foreground">@{username.toLowerCase()}123 • Joined {joinedDate}</p>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-8 py-4">
          <div className="text-center">
            <p className="text-xl font-bold">0</p>
            <p className="text-sm text-muted-foreground">Following</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold">0</p>
            <p className="text-sm text-muted-foreground">Followers</p>
          </div>
        </div>

        {/* Add Friends Button */}
        <div className="flex gap-2">
          <Button className="w-full flex items-center gap-2" variant="outline">
            <UserPlus className="h-4 w-4" />
            Add Friends
          </Button>
          <Button variant="outline" className="px-3">
            <Users className="h-4 w-4" />
          </Button>
        </div>

        {/* Credits Section */}
        <div className="space-y-3 bg-secondary/20 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            <h2 className="font-medium">Credits</h2>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Available Credits</span>
              <span className="font-semibold">{credits}/{MAX_CREDITS}</span>
            </div>
            <Progress value={(credits / MAX_CREDITS) * 100} className="h-2" />
            <p className="text-xs text-muted-foreground">
              Credits are used for AI-powered features
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile