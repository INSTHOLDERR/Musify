import { useMusicStore } from "@/stores/useMusicStore";
import FeaturedGridSkeleton from "@/components/skeletons/FeaturedGridSkeleton";
import PlayButton from "./PlayButton";
import { usePlayerStore } from "@/stores/usePlayerStore";

const FeaturedSection = () => {
  const { isLoading, featuredSongs, error } = useMusicStore();
  const { currentSong, isPlaying } = usePlayerStore();
  if (isLoading) return <FeaturedGridSkeleton />;
  if (error) return <p className="text-red-400/60 text-sm">{error}</p>;

  return (
    <div>
      <h2 className="text-base font-bold text-white/75 mb-3">Featured</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {featuredSongs.map((song) => {
          const isCurrent = currentSong?._id === song._id;
          return (
            <div key={song._id}
              className={`relative overflow-hidden rounded-2xl group cursor-pointer transition-all duration-300 hover:scale-[1.02]
                ${isCurrent ? "ring-1 ring-purple-500/40" : ""}`}
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              {/* Blurred bg */}
              <div className="absolute inset-0 overflow-hidden">
                <img src={song.imageUrl} className="w-full h-full object-cover opacity-15 blur-xl scale-110" />
              </div>
              <div className="relative z-10 flex items-center gap-3 p-3">
                <img src={song.imageUrl} alt={song.title}
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover shrink-0 shadow-lg ${isCurrent && isPlaying ? "ring-2 ring-purple-400/40" : ""}`} />
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-sm truncate ${isCurrent ? "text-purple-300" : "text-white/88"}`}>{song.title}</p>
                  <p className="text-xs text-white/38 truncate">{song.artist}</p>
                </div>
                <div className="shrink-0"><PlayButton song={song} /></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default FeaturedSection;
