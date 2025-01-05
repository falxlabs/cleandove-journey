import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ChevronLeft, User, Infinity, DollarSign, Gift, Share2, ThumbsUp, MessageSquareHeart, Contact, FileText, Settings as SettingsIcon, Clock } from "lucide-react"
import { Link } from "react-router-dom"

const Settings = () => {
  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Header */}
      <header className="p-4 flex items-center gap-4">
        <Link to="/" className="text-white">
          <ChevronLeft className="h-6 w-6" />
        </Link>
        <span className="text-xl">Back</span>
      </header>

      {/* Profile Section */}
      <div className="px-4 py-6 flex flex-col items-center gap-4">
        <Avatar className="h-24 w-24 bg-blue-500">
          <AvatarImage src="" />
          <AvatarFallback>
            <User className="h-12 w-12 text-blue-300" />
          </AvatarFallback>
        </Avatar>
        <Input 
          placeholder="Write your name..." 
          className="bg-transparent border-b border-t-0 border-x-0 rounded-none text-center text-xl placeholder:text-gray-500"
        />
      </div>

      {/* Form Fields */}
      <div className="px-4 space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span>Age range</span>
            <Select defaultValue="25-34">
              <SelectTrigger className="w-32 bg-transparent">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="18-24">18-24</SelectItem>
                <SelectItem value="25-34">25-34</SelectItem>
                <SelectItem value="35-44">35-44</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Input placeholder="Write..." className="bg-transparent" />

          <div className="flex justify-between items-center">
            <span>Religious content</span>
            <Switch />
          </div>
        </div>

        {/* Subscription Section */}
        <div className="space-y-4">
          <h2 className="text-gray-500 text-sm font-medium">SUBSCRIPTION</h2>
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start gap-3">
              <User className="h-5 w-5" />
              <span>Membership</span>
              <span className="ml-auto text-gray-500">Trial</span>
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3">
              <Infinity className="h-5 w-5" />
              <span>Change Premium Plan</span>
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3">
              <DollarSign className="h-5 w-5" />
              <span>Redeem Promotional Code</span>
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3">
              <DollarSign className="h-5 w-5 border rounded-full" />
              <span>Restore purchases</span>
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3">
              <Gift className="h-5 w-5" />
              <span>Gift Bible Chat</span>
            </Button>
          </div>
        </div>

        {/* About Section */}
        <div className="space-y-4">
          <h2 className="text-gray-500 text-sm font-medium">ABOUT</h2>
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start gap-3">
              <Share2 className="h-5 w-5" />
              <span>Share Bible Chat & Earn</span>
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3">
              <ThumbsUp className="h-5 w-5" />
              <span>Rate us</span>
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3">
              <MessageSquareHeart className="h-5 w-5" />
              <span>Help us improve Bible Chat</span>
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3">
              <Share2 className="h-5 w-5" />
              <span>Share with friends</span>
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3">
              <Contact className="h-5 w-5" />
              <span>Contact us</span>
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3">
              <FileText className="h-5 w-5" />
              <span>Terms of use</span>
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3">
              <FileText className="h-5 w-5" />
              <span>Privacy policy</span>
            </Button>
          </div>
        </div>

        {/* Account Section */}
        <div className="space-y-4">
          <h2 className="text-gray-500 text-sm font-medium">ACCOUNT</h2>
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start gap-3">
              <FileText className="h-5 w-5" />
              <span>Login</span>
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3">
              <SettingsIcon className="h-5 w-5" />
              <span>Personalize your conversations</span>
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3">
              <Clock className="h-5 w-5" />
              <span>Manage your reminders</span>
            </Button>
          </div>
        </div>

        {/* App Version */}
        <div className="pt-6 text-gray-500 text-sm space-y-1">
          <p>App Version: 3.3.5</p>
          <p className="break-all">UID: tdaTiVuagxfZV8LBXwe1GlLH4Lh2</p>
        </div>
      </div>
    </div>
  )
}

export default Settings