import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Home, MessageSquare, History, User } from "lucide-react"
import { cn } from "@/lib/utils"

const Navigation = () => {
  const location = useLocation()
  
  const isActive = (path: string) => location.pathname === path

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-background">
      <nav className="container flex justify-around py-2">
        <Link to="/">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "flex flex-col items-center justify-center gap-1",
              isActive("/") && "text-primary"
            )}
          >
            <Home className="h-5 w-5" />
          </Button>
        </Link>
        <Link to="/chat">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "flex flex-col items-center justify-center gap-1",
              isActive("/chat") && "text-primary"
            )}
          >
            <MessageSquare className="h-5 w-5" />
          </Button>
        </Link>
        <Link to="/history">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "flex flex-col items-center justify-center gap-1",
              isActive("/history") && "text-primary"
            )}
          >
            <History className="h-5 w-5" />
          </Button>
        </Link>
        <Link to="/profile">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "flex flex-col items-center justify-center gap-1",
              isActive("/profile") && "text-primary"
            )}
          >
            <User className="h-5 w-5" />
          </Button>
        </Link>
      </nav>
    </div>
  )
}

export default Navigation