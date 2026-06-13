import { Song } from "@/types";
import SectionGridSkeleton from "./SectionGridSkeleton";
import PlayButton from "./PlayButton";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useWishlistStore } from "@/stores/useWishlistStore";
import { Heart } from "lucide-react";
import { useState } from "react";
import WishlistPicker from "@/components/WishlistPicker";

interface Props {
  title: string;
  songs: Song[];
  isLoading: boolean;
  onSeeAll?: () => void;
}

const SectionGrid = ({ title, songs, isLoading, onSeeAll }: Props) => {
  const { currentSong, isPlaying, setCurrentSong, initializeQueue } = usePlayerStore();
  const { isInAnyWishlist } = useWishlistStore();
  const [pickerSong, setPickerSong] = useState<Song | null>(null);

  if (isLoading) return <SectionGridSkeleton />;

  return (
    <>
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-white/75">{title}</h2>
          {onSeeAll && (
            <button onClick={onSeeAll} className="text-xs text-purple-400/55 hover:text-purple-300 transition-colors">
              See all →
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {songs.map((song) => {
            const isCurrent = currentSong?._id === song._id;
            const inWishlist = isInAnyWishlist(song._id);
            return (
              <div key={song._id}
                onClick={() => { initializeQueue(songs); setCurrentSong(song); }}
                className={`group rounded-2xl p-3 cursor-pointer transition-all hover:scale-[1.02] ${isCurrent ? "ring-1 ring-purple-500/30" : ""}`}
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="relative aspect-square rounded-xl overflow-hidden mb-2.5 shadow-lg">
                  <img src={song.imageUrl} alt={song.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  {isCurrent && isPlaying && (
                    <div className="absolute top-2 left-2 flex items-end gap-[2px]" style={{ height: 14 }}>
                      <span className="bar" style={{ height: 8 }} /><span className="bar" style={{ height: 14 }} />
                      <span className="bar" style={{ height: 6 }} /><span className="bar" style={{ height: 11 }} />
                    </div>
                  )}
                  {/* Heart — always visible if in any wishlist, else shows on hover */}
                  <button
                    onClick={(e) => { e.stopPropagation(); setPickerSong(song); }}
                    className={`absolute top-2 right-2 transition-all p-1.5 rounded-full
                      ${inWishlist
                        ? "opacity-100 bg-pink-500/25"
                        : "opacity-0 group-hover:opacity-100 bg-black/35"
                      } hover:scale-110 active:scale-95`}>
                    <Heart className={`size-3.5 transition-all ${inWishlist ? "fill-pink-400 text-pink-400" : "text-white/75"}`} />
                  </button>
                  <div className="absolute bottom-2 right-2"><PlayButton song={song} /></div>
                </div>
                <p className={`font-semibold text-sm truncate mb-0.5 ${isCurrent ? "text-purple-300" : "text-white/82"}`}>{song.title}</p>
                <p className="text-xs text-white/32 truncate">{song.artist}</p>
              </div>
            );
          })}
        </div>
      </div>
      {pickerSong && <WishlistPicker song={pickerSong} onClose={() => setPickerSong(null)} />}
    </>
  );
};
export default SectionGrid;
