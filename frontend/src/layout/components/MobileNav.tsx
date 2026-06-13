import { HomeIcon, Library, MessageCircle, Music2, Heart } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { SignedIn } from "@clerk/clerk-react";
import { cn } from "@/lib/utils";

const MobileNav = () => {
  const loc = useLocation();
  const links = [
    { to: "/", icon: HomeIcon, label: "Home" },
    { to: "/music", icon: Music2, label: "Music" },
    { to: "/wishlist", icon: Heart, label: "Wishlist" },
    { to: "/library", icon: Library, label: "Library" },
  ];

  return (
    <nav className="glass-dark border-t border-white/6 flex items-center justify-around px-2 py-1.5 shrink-0">
      {links.map(({ to, icon: Icon, label }) => (
        <Link key={to} to={to} className={cn(
          "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all",
          loc.pathname === to ? "text-purple-400" : "text-white/30"
        )}>
          <Icon className="size-5" />
          <span className="text-[9px] font-medium">{label}</span>
          {loc.pathname === to && <div className="w-1 h-1 rounded-full bg-purple-400" />}
        </Link>
      ))}
      <SignedIn>
        <Link to="/chat" className={cn(
          "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all",
          loc.pathname === "/chat" ? "text-purple-400" : "text-white/30"
        )}>
          <MessageCircle className="size-5" />
          <span className="text-[9px] font-medium">Chat</span>
          {loc.pathname === "/chat" && <div className="w-1 h-1 rounded-full bg-purple-400" />}
        </Link>
      </SignedIn>
    </nav>
  );
};
export default MobileNav;
