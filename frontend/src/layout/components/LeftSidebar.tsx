import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { HomeIcon, Library, MessageCircle, Music2, Heart } from "lucide-react";
import { SignedIn } from "@clerk/clerk-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMusicStore } from "@/stores/useMusicStore";
import PlaylistSkeleton from "@/components/skeletons/PlaylistSkeleton";
import { cn } from "@/lib/utils";

const LeftSidebar = () => {
  const { albums, fetchAlbums, isLoading } = useMusicStore();
  const loc = useLocation();
  useEffect(() => { fetchAlbums(); }, [fetchAlbums]);

  const navLinks = [
    { to: "/", icon: HomeIcon, label: "Home" },
    { to: "/music", icon: Music2, label: "Music" },
    { to: "/wishlist", icon: Heart, label: "Wishlist" },
  ];

  return (
    <aside className="w-[220px] shrink-0 flex flex-col gap-2 h-full pb-2">
      {/* Brand */}
      <div className="glass rounded-2xl p-4 flex items-center gap-3 shrink-0">
        <div className="relative">
          <div className="absolute inset-0 bg-purple-500 blur-md rounded-xl opacity-60" />
          <div className="relative btn-gradient rounded-xl p-2"><Music2 className="size-4 text-white" /></div>
        </div>
        <span className="font-bold text-lg gradient-text tracking-tight">Musiffy</span>
      </div>

      {/* Nav */}
      <div className="glass rounded-2xl p-2.5 space-y-0.5 shrink-0">
        {navLinks.map(({ to, icon: Icon, label }) => (
          <Link key={to} to={to} className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
            loc.pathname === to
              ? "bg-gradient-to-r from-purple-500/20 to-pink-500/10 text-purple-300 border border-purple-500/20"
              : "text-white/45 hover:text-white/80 hover:bg-white/5 border border-transparent"
          )}>
            <Icon className="size-4 shrink-0" />{label}
          </Link>
        ))}
        <SignedIn>
          <Link to="/chat" className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
            loc.pathname === "/chat"
              ? "bg-gradient-to-r from-purple-500/20 to-pink-500/10 text-purple-300 border border-purple-500/20"
              : "text-white/45 hover:text-white/80 hover:bg-white/5 border border-transparent"
          )}>
            <MessageCircle className="size-4 shrink-0" />Messages
          </Link>
        </SignedIn>
      </div>

      {/* Library */}
      <div className="glass rounded-2xl p-3 flex-1 flex flex-col min-h-0">
        <div className="flex items-center gap-2 px-1 mb-3 shrink-0">
          <Library className="size-3.5 text-purple-400" />
          <span className="text-[10px] uppercase tracking-widest font-semibold text-white/35">Library</span>
        </div>
        <ScrollArea className="flex-1">
          <div className="space-y-0.5 pr-1">
            {isLoading ? <PlaylistSkeleton /> : albums.map((album) => (
              <Link key={album._id} to={`/albums/${album._id}`}
                className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/5 group transition-all cursor-pointer">
                <div className="relative shrink-0">
                  <img src={album.imageUrl} alt={album.title} className="size-9 rounded-lg object-cover" />
                  <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-white/10" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate text-white/75 group-hover:text-white/95 transition-colors">{album.title}</p>
                  <p className="text-[11px] text-white/30 truncate">{album.artist}</p>
                </div>
              </Link>
            ))}
          </div>
        </ScrollArea>
      </div>
    </aside>
  );
};
export default LeftSidebar;
