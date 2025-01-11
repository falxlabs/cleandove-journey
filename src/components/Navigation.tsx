import { ShieldCheck, MessageSquare, History, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Navigation = () => {
  const location = useLocation();

  // Hide navigation on conversation, settings, and streak pages
  if (location.pathname === "/conversation" || location.pathname === "/settings" || location.pathname === "/streak") {
    return null;
  }

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { icon: ShieldCheck, label: "Quest", path: "/" },
    { icon: MessageSquare, label: "Chat", path: "/chat" },
    { icon: History, label: "History", path: "/history" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border px-6 py-2">
      <div className="flex justify-between items-center max-w-screen-xl mx-auto">
        {navItems.map(({ icon: Icon, label, path }) => (
          <Link
            key={path}
            to={path}
            className={`flex flex-col items-center p-2 transition-colors duration-200 ${
              isActive(path)
                ? "text-primary"
                : "text-muted-foreground hover:text-primary"
            }`}
          >
            <Icon className="h-6 w-6" />
            <span className="text-xs mt-1">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;