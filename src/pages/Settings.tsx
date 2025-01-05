import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, User, Infinity, DollarSign, Gift, Share2, ThumbsUp, MessageSquareHeart, Contact, FileText, Settings as SettingsIcon, Clock } from "lucide-react"
import { Link } from "react-router-dom"

const Settings = () => {
  return (
    <div className="min-h-screen pb-20 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => window.history.back()}
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      {/* Profile Section */}
      <div className="px-6 py-6 space-y-6">
        <div className="flex flex-col items-center gap-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src="" />
            <AvatarFallback className="bg-primary/10">
              <User className="h-12 w-12 text-primary" />
            </AvatarFallback>
          </Avatar>
          <Input 
            placeholder="Write your name..." 
            className="max-w-[200px] text-center text-xl"
          />
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Age range</span>
              <Select defaultValue="25-34">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="13-17">13-17</SelectItem>
                  <SelectItem value="18-24">18-24</SelectItem>
                  <SelectItem value="25-34">25-34</SelectItem>
                  <SelectItem value="35-44">35-44</SelectItem>
                  <SelectItem value="45-54">45-54</SelectItem>
                  <SelectItem value="55+">55+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm">Religious content</span>
              <Switch />
            </div>
          </div>

          {/* Subscription Section */}
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground">SUBSCRIPTION</h2>
            <div className="space-y-1">
              <Button variant="ghost" className="w-full justify-start gap-3 h-12">
                <User className="h-5 w-5 text-primary" />
                <span>Membership</span>
                <span className="ml-auto text-muted-foreground">Trial</span>
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3 h-12">
                <Infinity className="h-5 w-5 text-primary" />
                <span>Change Premium Plan</span>
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3 h-12">
                <DollarSign className="h-5 w-5 text-primary" />
                <span>Redeem Promotional Code</span>
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3 h-12">
                <DollarSign className="h-5 w-5 text-primary border rounded-full" />
                <span>Restore purchases</span>
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3 h-12">
                <Gift className="h-5 w-5 text-primary" />
                <span>Gift Cleansed</span>
              </Button>
            </div>
          </div>

          {/* About Section */}
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground">ABOUT</h2>
            <div className="space-y-1">
              <Button variant="ghost" className="w-full justify-start gap-3 h-12">
                <Share2 className="h-5 w-5 text-primary" />
                <span>Share Cleansed & Earn</span>
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3 h-12">
                <ThumbsUp className="h-5 w-5 text-primary" />
                <span>Rate us</span>
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3 h-12">
                <MessageSquareHeart className="h-5 w-5 text-primary" />
                <span>Help us improve Cleansed</span>
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3 h-12">
                <Share2 className="h-5 w-5 text-primary" />
                <span>Share with friends</span>
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3 h-12">
                <Contact className="h-5 w-5 text-primary" />
                <span>Contact us</span>
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3 h-12">
                <FileText className="h-5 w-5 text-primary" />
                <span>Terms of use</span>
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3 h-12">
                <FileText className="h-5 w-5 text-primary" />
                <span>Privacy policy</span>
              </Button>
            </div>
          </div>

          {/* Account Section */}
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground">ACCOUNT</h2>
            <div className="space-y-1">
              <Button variant="ghost" className="w-full justify-start gap-3 h-12">
                <FileText className="h-5 w-5 text-primary" />
                <span>Login</span>
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3 h-12">
                <SettingsIcon className="h-5 w-5 text-primary" />
                <span>Personalize your conversations</span>
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3 h-12">
                <Clock className="h-5 w-5 text-primary" />
                <span>Manage your reminders</span>
              </Button>
            </div>
          </div>

          {/* App Version */}
          <div className="pt-6 space-y-1">
            <p className="text-sm text-muted-foreground">App Version: 1.0.0</p>
            <p className="text-sm text-muted-foreground break-all">UID: mock-user-id-123456789</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;