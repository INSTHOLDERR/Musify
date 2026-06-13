import Topbar from "@/components/Topbar";
import { useMusicStore } from "@/stores/useMusicStore";
import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePlayerStore } from "@/stores/usePlayerStore";
import FeaturedSection from "./components/FeaturedSection";
import SectionGrid from "./components/SectionGrid";
import { Play, X } from "lucide-react";
import { Song } from "@/types";
import { useWishlistStore } from "@/stores/useWishlistStore";
import { Heart } from "lucide-react";

import { fmtDuration as fmt } from "@/lib/utils";

const greet = () => {
  const h = new Date().getHours();
  if (h < 5) return "Still up? 🌙";
  if (h < 12) return "Good morning ☀️";
  if (h < 17) return "Good afternoon";
  return "Good evening 🌙";
};

const AllSongsModal = ({ songs, title, onClose }: { songs: Song[]; title: string; onClose: () => void }) => {
  const { setCurrentSong, initializeQueue, currentSong, isPlaying } = usePlayerStore();
  const { toggleLike, isLiked } = useWishlistStore();

  const handlePlay = (song: Song) => {
    initializeQueue(songs);
    setCurrentSong(song);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}>
      <div className="glass rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col border border-white/10 shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 shrink-0">
          <h2 className="font-bold text-lg text-white">{title}</h2>
          <button onClick={onClose} className="text-white/35 hover:text-white/75 transition-colors">
            <X className="size-5" />
          </button>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-3 space-y-0.5">
            {songs.map((song, i) => {
              const isCurrent = currentSong?._id === song._id;
              return (
                <div key={song._id} onClick={() => handlePlay(song)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all group
                    ${isCurrent ? "bg-purple-500/10 border border-purple-500/15" : "hover:bg-white/4 border border-transparent"}`}>
                  <span className="w-5 text-center text-xs text-white/25 shrink-0">
                    {isCurrent && isPlaying ? (
                      <span className="text-purple-400">♪</span>
                    ) : (
                      <>{i + 1}</>
                    )}
                  </span>
                  <img src={song.imageUrl} className="size-9 rounded-lg object-cover ring-1 ring-white/8 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${isCurrent ? "text-purple-300" : "text-white/82"}`}>{song.title}</p>
                    <p className="text-xs text-white/30 truncate">{song.artist}</p>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); toggleLike(song); }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1">
                    <Heart className={`size-3.5 ${isLiked(song._id) ? "fill-pink-400 text-pink-400" : "text-white/35"}`} />
                  </button>
                  <span className="text-xs text-white/25 shrink-0 w-10 text-right">{fmt(song.duration)}</span>
                  <Play className="size-3.5 text-white/35 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

const HomePage = () => {
  const { fetchFeaturedSongs, fetchMadeForYouSongs, fetchTrendingSongs, fetchAllSongs,
          isLoading, madeForYouSongs, featuredSongs, trendingSongs } = useMusicStore();
  const { initializeQueue } = usePlayerStore();
  const [seeAllData, setSeeAllData] = useState<{ songs: Song[]; title: string } | null>(null);

  useEffect(() => {
    fetchFeaturedSongs(); fetchMadeForYouSongs(); fetchTrendingSongs(); fetchAllSongs();
  }, [fetchFeaturedSongs, fetchMadeForYouSongs, fetchTrendingSongs, fetchAllSongs]);

  useEffect(() => {
    if (madeForYouSongs.length && featuredSongs.length && trendingSongs.length)
      initializeQueue([...featuredSongs, ...madeForYouSongs, ...trendingSongs]);
  }, [initializeQueue, madeForYouSongs, trendingSongs, featuredSongs]);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <Topbar />
      <ScrollArea className="flex-1">
        <div className="p-5 sm:p-6 space-y-8 fade-up">
          <div>
            <p className="text-xs text-purple-400/55 uppercase tracking-widest font-semibold mb-1">{greet()}</p>
            <h1 className="text-2xl sm:text-3xl font-bold">
              What are you <span className="gradient-text">vibing</span> to?
            </h1>
          </div>
          <FeaturedSection />
          <SectionGrid title="Made For You" songs={madeForYouSongs} isLoading={isLoading}
            onSeeAll={() => setSeeAllData({ songs: madeForYouSongs, title: "Made For You" })} />
          <SectionGrid title="🔥 Trending" songs={trendingSongs} isLoading={isLoading}
            onSeeAll={() => setSeeAllData({ songs: trendingSongs, title: "🔥 Trending" })} />
        </div>
      </ScrollArea>

      {seeAllData && (
        <AllSongsModal songs={seeAllData.songs} title={seeAllData.title} onClose={() => setSeeAllData(null)} />
      )}
    </div>
  );
};
export default HomePage;
