import { SignedOut, UserButton } from "@clerk/clerk-react";
import { LayoutDashboardIcon, Music2, Search, X } from "lucide-react";
import { Link } from "react-router-dom";
import SignInOAuthButtons from "./SignInOAuthButtons";
import { useAuthStore } from "@/stores/useAuthStore";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import { useState, useRef, useEffect } from "react";
import { useMusicStore } from "@/stores/useMusicStore";
import { usePlayerStore } from "@/stores/usePlayerStore";

const Topbar = () => {
  const { isAdmin } = useAuthStore();
  const { searchQuery, setSearchQuery, searchResults } = useMusicStore();
  const { setCurrentSong, initializeQueue } = usePlayerStore();
  const [focused, setFocused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setFocused(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSongClick = (song: any) => {
    if (searchResults.length) initializeQueue(searchResults);
    setCurrentSong(song);
    setSearchQuery("");
    setFocused(false);
  };

  const showDropdown = focused && searchQuery.trim().length > 0;

  return (
    <div className="flex flex-col border-b border-white/5 sticky top-0 z-30"
      style={{ background: "rgba(10,10,20,0.90)", backdropFilter: "blur(24px)" }}>

      {/* Row 1 — Logo (mobile) + Actions */}
      <div className="flex items-center justify-between px-4 pt-3 pb-1 sm:hidden">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="relative">
            <div className="absolute inset-0 bg-purple-500 blur-md rounded-xl opacity-60" />
            <div className="relative btn-gradient rounded-xl p-1.5"><Music2 className="size-3.5 text-white" /></div>
          </div>
          <span className="font-bold text-base gradient-text">Musiffy</span>
        </Link>
        <div className="flex items-center gap-2">
          {isAdmin && (
            <Link to="/admin" className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "text-xs border-purple-500/25 text-purple-300 hover:bg-purple-500/10 bg-transparent h-7 px-2"
            )}>
              <LayoutDashboardIcon className="size-3 mr-1" />Admin
            </Link>
          )}
          <SignedOut><SignInOAuthButtons /></SignedOut>
          <UserButton />
        </div>
      </div>

      {/* Row 2 — Search (mobile: full width; desktop: left side with actions) */}
      <div className="flex items-center gap-3 px-4 py-2.5">
        {/* Search */}
        <div ref={dropdownRef} className="relative flex-1 sm:max-w-sm">
          <div className="flex items-center gap-2 glass rounded-xl px-3 py-2 border border-white/5 focus-within:border-purple-500/30 transition-colors">
            <Search className="size-3.5 text-white/25 shrink-0" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              placeholder="Search songs, artists..."
              className="bg-transparent text-sm text-white/75 placeholder:text-white/20 outline-none w-full"
            />
            {searchQuery && (
              <button onClick={() => { setSearchQuery(""); setFocused(false); }} className="text-white/25 hover:text-white/55">
                <X className="size-3.5" />
              </button>
            )}
          </div>

          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1.5 glass-dark rounded-2xl border border-white/8 shadow-2xl overflow-hidden z-50 max-h-72 overflow-y-auto">
              {searchResults.length === 0 ? (
                <div className="px-4 py-6 text-center text-white/30 text-sm">No songs found</div>
              ) : (
                <>
                  <div className="px-4 py-2 border-b border-white/5">
                    <span className="text-[10px] text-white/25 uppercase tracking-widest font-semibold">{searchResults.length} results</span>
                  </div>
                  {searchResults.slice(0, 8).map((song) => (
                    <button key={song._id} onClick={() => handleSongClick(song)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors text-left">
                      <img src={song.imageUrl} className="size-9 rounded-lg object-cover ring-1 ring-white/8 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white/82 truncate">{song.title}</p>
                        <p className="text-xs text-white/30 truncate">{song.artist}</p>
                      </div>
                    </button>
                  ))}
                </>
              )}
            </div>
          )}
        </div>

        {/* Desktop right actions */}
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          {isAdmin && (
            <Link to="/admin" className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "text-xs border-purple-500/25 text-purple-300 hover:bg-purple-500/10 bg-transparent"
            )}>
              <LayoutDashboardIcon className="size-3 mr-1.5" />Admin
            </Link>
          )}
          <SignedOut><SignInOAuthButtons /></SignedOut>
          <UserButton />
        </div>
      </div>
    </div>
  );
};
export default Topbar;
