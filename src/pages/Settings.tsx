import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowRight } from "lucide-react"
import { useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useNavigate } from "react-router-dom"

const Settings = () => {
  const [credits, setCredits] = useState<number>(0)
  const navigate = useNavigate()
  const MAX_CREDITS = 10

  useEffect(() => {
    const fetchCredits = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user?.id) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('credits')
          .eq('id', session.user.id)
          .single()
        
        if (profile) {
          setCredits(profile.credits)
        }
      }
    }

    fetchCredits()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate('/auth')
  }

  return (
    <div className="min-h-screen pb-20 bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h1 className="text-xl font-semibold">Settings</h1>
        <Button variant="ghost" className="text-primary">
          Done
        </Button>
      </div>

      {/* Account Section */}
      <div className="px-6 mt-8">
        <h2 className="text-xl font-semibold mb-4">Account</h2>
        <div className="space-y-px bg-card rounded-lg overflow-hidden shadow-sm">
          <Button variant="ghost" className="w-full justify-between h-14 px-4">
            <span>Preferences</span>
            <ArrowRight className="h-5 w-5 text-muted-foreground" />
          </Button>
          <Button variant="ghost" className="w-full justify-between h-14 px-4">
            <span>Profile</span>
            <ArrowRight className="h-5 w-5 text-muted-foreground" />
          </Button>
          <Button variant="ghost" className="w-full justify-between h-14 px-4">
            <span>Notifications</span>
            <ArrowRight className="h-5 w-5 text-muted-foreground" />
          </Button>
          <Button variant="ghost" className="w-full justify-between h-14 px-4">
            <span>Social accounts</span>
            <ArrowRight className="h-5 w-5 text-muted-foreground" />
          </Button>
          <Button variant="ghost" className="w-full justify-between h-14 px-4">
            <span>Privacy settings</span>
            <ArrowRight className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>
      </div>

      {/* Subscription Section */}
      <div className="px-6 mt-8">
        <h2 className="text-xl font-semibold mb-4">Subscription</h2>
        <div className="space-y-4">
          {/* Daily Messages Section */}
          <div className="py-6 space-y-3 bg-card rounded-lg shadow-sm px-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Daily Messages Remaining</span>
              <span className="font-semibold">{credits}/{MAX_CREDITS}</span>
            </div>
            <Progress value={(credits / MAX_CREDITS) * 100} className="h-2" />
          </div>

          <div className="bg-card rounded-lg overflow-hidden shadow-sm">
            <Button variant="ghost" className="w-full justify-between h-14 px-4">
              <span>Choose a plan</span>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </Button>
          </div>

          <Button variant="ghost" className="w-full h-14 text-primary">
            RESTORE SUBSCRIPTION
          </Button>
        </div>
      </div>

      {/* Support Section */}
      <div className="px-6 mt-8">
        <h2 className="text-xl font-semibold mb-4">Support</h2>
        <div className="space-y-px bg-card rounded-lg overflow-hidden shadow-sm">
          <Button variant="ghost" className="w-full justify-between h-14 px-4">
            <span>Help Center</span>
            <ArrowRight className="h-5 w-5 text-muted-foreground" />
          </Button>
          <Button variant="ghost" className="w-full justify-between h-14 px-4">
            <span>Feedback</span>
            <ArrowRight className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>
      </div>

      {/* Sign Out Button */}
      <div className="px-6 mt-8">
        <Button 
          variant="ghost" 
          className="w-full h-14 text-primary"
          onClick={handleSignOut}
        >
          SIGN OUT
        </Button>
      </div>

      {/* Footer Links */}
      <div className="px-6 mt-8 space-y-4">
        <Button variant="link" className="text-primary">TERMS</Button>
        <Button variant="link" className="text-primary">PRIVACY POLICY</Button>
        <Button variant="link" className="text-primary">ACKNOWLEDGEMENTS</Button>
      </div>
    </div>
  )
}

export default Settings