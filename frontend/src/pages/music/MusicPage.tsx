import Topbar from "@/components/Topbar";
import { useMusicStore } from "@/stores/useMusicStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useWishlistStore } from "@/stores/useWishlistStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { Heart, Play, Clock, Music2 } from "lucide-react";
import { Song } from "@/types";
import WishlistPicker from "@/components/WishlistPicker";

const fmt = (s: number) => {
  if (!s || isNaN(s) || s <= 0) return "0:00";
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
};

const MusicPage = () => {
  const { featuredSongs, madeForYouSongs, trendingSongs,
          fetchFeaturedSongs, fetchMadeForYouSongs, fetchTrendingSongs, isLoading } = useMusicStore();
  const { setCurrentSong, initializeQueue, currentSong, isPlaying } = usePlayerStore();
  const { isInAnyWishlist } = useWishlistStore();
  const [pickerSong, setPickerSong] = useState<Song | null>(null);

  useEffect(() => {
    fetchFeaturedSongs(); fetchMadeForYouSongs(); fetchTrendingSongs();
  }, []);

  const allSongs = Array.from(
    new Map([...featuredSongs, ...madeForYouSongs, ...trendingSongs].map(s => [s._id, s])).values()
  );

  const handlePlay = (song: Song) => { initializeQueue(allSongs); setCurrentSong(song); };

  return (
    <>
      <div className="h-full flex flex-col overflow-hidden">
        <Topbar />
        <ScrollArea className="flex-1">
          <div className="p-5 sm:p-6 fade-up">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 btn-gradient rounded-xl flex items-center justify-center glow-sm shrink-0">
                <Music2 className="size-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">All Music</h1>
                <p className="text-sm text-white/35">{allSongs.length} songs</p>
              </div>
            </div>

            <div className="grid grid-cols-[32px_1fr_80px_32px] sm:grid-cols-[32px_1fr_140px_64px_32px] gap-3 px-3 py-2 border-b border-white/5 mb-1 text-[10px] uppercase tracking-widest text-white/18 font-semibold">
              <span>#</span><span>Title</span>
              <span className="hidden sm:block">Artist</span>
              <span className="flex justify-end items-center"><Clock className="size-3" /></span>
              <span />
            </div>

            <div className="space-y-0.5">
              {isLoading ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="grid grid-cols-[32px_1fr_80px_32px] gap-3 px-3 py-3 rounded-xl animate-pulse">
                  <div className="h-4 bg-white/5 rounded" />
                  <div className="flex gap-3 items-center"><div className="size-9 rounded-lg bg-white/5 shrink-0" /><div className="h-3 bg-white/5 rounded flex-1" /></div>
                  <div className="h-3 bg-white/4 rounded" /><div className="h-3 bg-white/4 rounded" />
                </div>
              )) : allSongs.map((song, i) => {
                const isCurrent = currentSong?._id === song._id;
                const inWishlist = isInAnyWishlist(song._id);
                return (
                  <div key={song._id} onClick={() => handlePlay(song)}
                    className={`grid grid-cols-[32px_1fr_80px_32px] sm:grid-cols-[32px_1fr_140px_64px_32px] gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all group
                      ${isCurrent ? "bg-purple-500/10 border border-purple-500/15" : "hover:bg-white/4 border border-transparent"}`}>
                    <div className="flex items-center justify-center">
                      {isCurrent && isPlaying ? (
                        <div className="flex items-end gap-[2px]" style={{ height: 14 }}>
                          <span className="bar" style={{ height: 8 }} /><span className="bar" style={{ height: 14 }} /><span className="bar" style={{ height: 6 }} />
                        </div>
                      ) : (
                        <><span className="text-white/22 text-xs group-hover:hidden">{i + 1}</span>
                        <Play className="size-3.5 text-white/45 hidden group-hover:block fill-current" /></>
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
                    <span className="flex items-center justify-end text-white/22 text-xs tabular-nums">{fmt(song.duration)}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); setPickerSong(song); }}
                      className={`flex items-center justify-center transition-all ${inWishlist ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                      <Heart className={`size-3.5 transition-all ${inWishlist ? "fill-pink-400 text-pink-400" : "text-white/35"}`} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </ScrollArea>
      </div>
      {pickerSong && <WishlistPicker song={pickerSong} onClose={() => setPickerSong(null)} />}
    </>
  );
};
export default MusicPage;
