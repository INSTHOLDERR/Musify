import Topbar from "@/components/Topbar";
import { useWishlistStore } from "@/stores/useWishlistStore";
import { useMusicStore } from "@/stores/useMusicStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { Heart, Plus, Trash2, Play, X, Clock, ListMusic } from "lucide-react";
import { Song } from "@/types";

const fmt = (s: number) => { if (!s || isNaN(s) || !isFinite(s) || s <= 0) return "0:00"; return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`; };

const CreateWishlistModal = ({ onClose, onCreate }: { onClose: () => void; onCreate: (name: string) => void }) => {
  const [name, setName] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}>
      <div className="glass rounded-2xl w-full max-w-sm p-6 border border-white/10 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-lg text-white">New Wishlist</h2>
          <button onClick={onClose} className="text-white/35 hover:text-white/75"><X className="size-5" /></button>
        </div>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && name.trim() && (onCreate(name.trim()), onClose())}
          placeholder="Wishlist name..."
          autoFocus
          className="w-full glass rounded-xl px-4 py-3 text-sm text-white/80 placeholder:text-white/25 outline-none border border-white/8 focus:border-purple-500/40 mb-4"
        />
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl text-sm text-white/45 hover:bg-white/5 transition-colors">Cancel</button>
          <button
            onClick={() => { if (name.trim()) { onCreate(name.trim()); onClose(); } }}
            disabled={!name.trim()}
            className="flex-1 btn-gradient rounded-xl text-sm font-semibold py-2.5 disabled:opacity-40">
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

const WishlistPage = () => {
  const { wishlists, createWishlist, deleteWishlist, removeFromWishlist } = useWishlistStore();
  const { featuredSongs, madeForYouSongs, trendingSongs, fetchFeaturedSongs, fetchMadeForYouSongs, fetchTrendingSongs } = useMusicStore();
  const { setCurrentSong, initializeQueue, currentSong, isPlaying } = usePlayerStore();
  const [activeId, setActiveId] = useState("liked");
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    fetchFeaturedSongs(); fetchMadeForYouSongs(); fetchTrendingSongs();
  }, []);

  const allSongs = Array.from(
    new Map([...featuredSongs, ...madeForYouSongs, ...trendingSongs].map(s => [s._id, s])).values()
  );

  const activeWishlist = wishlists.find(w => w.id === activeId);
  const wishlistSongs: Song[] = (activeWishlist?.songIds ?? [])
    .map(id => allSongs.find(s => s._id === id))
    .filter(Boolean) as Song[];

  const handlePlay = (song: Song) => {
    if (wishlistSongs.length) initializeQueue(wishlistSongs);
    setCurrentSong(song);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <Topbar />
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-[200px] shrink-0 border-r border-white/5 flex flex-col p-3 gap-1 overflow-y-auto hidden sm:flex">
          <div className="flex items-center justify-between px-2 py-1.5 mb-1">
            <span className="text-[10px] text-white/25 uppercase tracking-widest font-semibold">Wishlists</span>
            <button onClick={() => setShowCreate(true)} className="text-white/30 hover:text-purple-300 transition-colors">
              <Plus className="size-3.5" />
            </button>
          </div>
          {wishlists.map(w => (
            <button key={w.id} onClick={() => setActiveId(w.id)}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all group ${
                activeId === w.id
                  ? "bg-gradient-to-r from-purple-500/20 to-pink-500/10 text-purple-300 border border-purple-500/20"
                  : "text-white/45 hover:text-white/75 hover:bg-white/5 border border-transparent"
              }`}>
              {w.id === "liked"
                ? <Heart className={`size-3.5 shrink-0 ${activeId === w.id ? "fill-pink-400 text-pink-400" : ""}`} />
                : <ListMusic className="size-3.5 shrink-0" />
              }
              <span className="text-sm font-medium truncate flex-1">{w.name}</span>
              <span className="text-[10px] text-white/25 shrink-0">{w.songIds.length}</span>
              {w.id !== "liked" && (
                <button onClick={(e) => { e.stopPropagation(); deleteWishlist(w.id); if (activeId === w.id) setActiveId("liked"); }}
                  className="opacity-0 group-hover:opacity-100 text-white/25 hover:text-red-400 transition-all">
                  <Trash2 className="size-3" />
                </button>
              )}
            </button>
          ))}
          <button onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-white/25 hover:text-white/55 hover:bg-white/4 border border-dashed border-white/8 mt-1 transition-all text-sm">
            <Plus className="size-3.5" />New wishlist
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile wishlist selector */}
          <div className="flex sm:hidden items-center gap-2 px-4 py-2 border-b border-white/5 overflow-x-auto">
            {wishlists.map(w => (
              <button key={w.id} onClick={() => setActiveId(w.id)}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeId === w.id ? "bg-purple-500/20 text-purple-300 border border-purple-500/25" : "text-white/40 border border-white/8"
                }`}>
                {w.id === "liked" && <Heart className={`size-3 ${activeId === w.id ? "fill-pink-400 text-pink-400" : ""}`} />}
                {w.name}
              </button>
            ))}
            <button onClick={() => setShowCreate(true)} className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs text-white/30 border border-dashed border-white/8">
              <Plus className="size-3" />New
            </button>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-5 sm:p-6">
              {/* Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${activeWishlist?.id === "liked" ? "bg-gradient-to-br from-pink-500/30 to-purple-500/30 border border-pink-500/20" : "btn-gradient"}`}>
                  {activeWishlist?.id === "liked"
                    ? <Heart className="size-7 fill-pink-400 text-pink-400" />
                    : <ListMusic className="size-7 text-white" />
                  }
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">{activeWishlist?.name}</h1>
                  <p className="text-sm text-white/35">{wishlistSongs.length} songs</p>
                </div>
                {activeWishlist?.id !== "liked" && (
                  <button onClick={() => { deleteWishlist(activeWishlist!.id); setActiveId("liked"); }}
                    className="ml-auto text-white/25 hover:text-red-400 transition-colors p-2">
                    <Trash2 className="size-4" />
                  </button>
                )}
              </div>

              {wishlistSongs.length === 0 ? (
                <div className="text-center py-16">
                  <Heart className="size-10 text-white/15 mx-auto mb-3" />
                  <p className="text-white/35 text-sm">
                    {activeWishlist?.id === "liked" ? "Like songs to add them here" : "No songs in this wishlist yet"}
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-[32px_1fr_80px_32px] sm:grid-cols-[32px_1fr_120px_64px_32px] gap-3 px-3 py-2 border-b border-white/5 mb-1 text-[10px] uppercase tracking-widest text-white/18 font-semibold">
                    <span>#</span><span>Title</span>
                    <span className="hidden sm:block">Artist</span>
                    <span className="flex justify-end items-center"><Clock className="size-3" /></span>
                    <span />
                  </div>
                  <div className="space-y-0.5">
                    {wishlistSongs.map((song, i) => {
                      const isCurrent = currentSong?._id === song._id;
                      return (
                        <div key={song._id} onClick={() => handlePlay(song)}
                          className={`grid grid-cols-[32px_1fr_80px_32px] sm:grid-cols-[32px_1fr_120px_64px_32px] gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all group
                            ${isCurrent ? "bg-purple-500/10 border border-purple-500/15" : "hover:bg-white/4 border border-transparent"}`}>
                          <div className="flex items-center justify-center">
                            {isCurrent && isPlaying ? (
                              <div className="flex items-end gap-[2px]" style={{ height: 14 }}>
                                <span className="bar" style={{ height: 8 }} /><span className="bar" style={{ height: 14 }} /><span className="bar" style={{ height: 6 }} />
                              </div>
                            ) : (
                              <><span className="text-white/22 text-xs group-hover:hidden">{i + 1}</span><Play className="size-3.5 text-white/45 hidden group-hover:block fill-current" /></>
                            )}
                          </div>
                          <div className="flex items-center gap-3 min-w-0">
                            <img src={song.imageUrl} className="size-9 rounded-lg object-cover ring-1 ring-white/8 shrink-0" />
                            <div className="min-w-0">
                              <p className={`font-medium text-sm truncate ${isCurrent ? "text-purple-300" : "text-white/82"}`}>{song.title}</p>
                              <p className="text-xs text-white/32 truncate sm:hidden">{song.artist}</p>
                            </div>
                          </div>
                          <span className="hidden sm:flex items-center text-white/35 text-xs truncate">{song.artist}</span>
                          <span className="flex items-center justify-end text-white/22 text-xs">{fmt(song.duration)}</span>
                          <button onClick={(e) => { e.stopPropagation(); removeFromWishlist(activeId, song._id); }}
                            className="flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white/25 hover:text-red-400">
                            <X className="size-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>

      {showCreate && <CreateWishlistModal onClose={() => setShowCreate(false)} onCreate={createWishlist} />}
    </div>
  );
};
export default WishlistPage;
