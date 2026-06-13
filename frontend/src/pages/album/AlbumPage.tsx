import { ScrollArea } from "@/components/ui/scroll-area";
import { useMusicStore } from "@/stores/useMusicStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useWishlistStore } from "@/stores/useWishlistStore";
import { ArrowLeft, Clock, Heart, Pause, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import WishlistPicker from "@/components/WishlistPicker";
import { Song } from "@/types";

const fmt = (s: number) => {
  if (!s || isNaN(s) || s <= 0) return "0:00";
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

const AlbumPage = () => {
  const { albumId } = useParams();
  const navigate = useNavigate();
  const { fetchAlbumById, currentAlbum, isLoading } = useMusicStore();
  const { currentSong, isPlaying, playAlbum, togglePlay } = usePlayerStore();
  const { isInAnyWishlist } = useWishlistStore();
  const [pickerSong, setPickerSong] = useState<Song | null>(null);

  useEffect(() => { if (albumId) fetchAlbumById(albumId); }, [albumId, fetchAlbumById]);

  if (isLoading || !currentAlbum) return (
    <div className="h-full flex items-center justify-center">
      <div className="spinner" style={{ width: 32, height: 32 }} />
    </div>
  );

  const isAlbumPlaying = isPlaying && currentAlbum.songs.some(s => s._id === currentSong?._id);
  const handlePlay = () => {
    if (currentAlbum.songs.some(s => s._id === currentSong?._id)) togglePlay();
    else playAlbum(currentAlbum.songs, 0);
  };

  return (
    <>
      <div className="h-full flex flex-col overflow-hidden fade-up">
        <ScrollArea className="flex-1">
          {/* Hero */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0">
              <img src={currentAlbum.imageUrl} className="w-full h-full object-cover blur-2xl scale-110 opacity-25" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(10,10,20,0.4) 0%, #0a0a14 85%)" }} />
            </div>
            <div className="relative z-10 p-6 sm:p-8">
              <button onClick={() => navigate(-1)}
                className="flex items-center gap-1.5 text-white/35 hover:text-white/65 text-sm mb-6 transition-colors group">
                <ArrowLeft className="size-4 group-hover:-translate-x-0.5 transition-transform" />Back
              </button>
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end">
                <div className="relative shrink-0 mx-auto sm:mx-0">
                  <div className="absolute -inset-3 rounded-2xl blur-2xl opacity-35" style={{ background: "linear-gradient(135deg,#9333ea,#ec4899)" }} />
                  <img src={currentAlbum.imageUrl} alt={currentAlbum.title}
                    className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-2xl object-cover shadow-2xl ring-1 ring-white/10" />
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-purple-400/55 font-semibold mb-2">Album</p>
                  <h1 className="text-3xl sm:text-5xl font-black text-white mb-2 leading-tight">{currentAlbum.title}</h1>
                  <p className="text-white/45 text-sm">{currentAlbum.artist} · {currentAlbum.songs.length} songs · {currentAlbum.releaseYear}</p>
                  <button onClick={handlePlay}
                    className="btn-gradient mt-5 px-7 py-2.5 rounded-full text-sm font-semibold glow inline-flex items-center gap-2">
                    {isAlbumPlaying
                      ? <><Pause className="size-4 fill-white" />Pause</>
                      : <><Play className="size-4 fill-white ml-0.5" />Play All</>}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Track list */}
          <div className="px-4 sm:px-6 pb-8">
            <div className="grid grid-cols-[32px_1fr_32px_80px] sm:grid-cols-[32px_1fr_32px_140px_64px] gap-3 px-3 py-2 border-b border-white/5 mb-1 text-[10px] uppercase tracking-widest text-white/18 font-semibold">
              <span>#</span><span>Title</span><span />
              <span className="hidden sm:block">Date</span>
              <span className="flex justify-end"><Clock className="size-3" /></span>
            </div>
            {currentAlbum.songs.map((song, i) => {
              const isCurrent = currentSong?._id === song._id;
              const inWishlist = isInAnyWishlist(song._id);
              return (
                <div key={song._id} onClick={() => playAlbum(currentAlbum.songs, i)}
                  className={`grid grid-cols-[32px_1fr_32px_80px] sm:grid-cols-[32px_1fr_32px_140px_64px] gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all group
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
                      <p className="text-xs text-white/32 truncate">{song.artist}</p>
                    </div>
                  </div>
                  {/* Heart */}
                  <button
                    onClick={(e) => { e.stopPropagation(); setPickerSong(song); }}
                    className={`flex items-center justify-center transition-all ${inWishlist ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                    <Heart className={`size-3.5 ${inWishlist ? "fill-pink-400 text-pink-400" : "text-white/35"}`} />
                  </button>
                  <span className="hidden sm:flex items-center text-white/22 text-xs">{song.createdAt?.split("T")[0]}</span>
                  <span className="flex items-center justify-end text-white/22 text-xs tabular-nums">{fmt(song.duration)}</span>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>
      {pickerSong && <WishlistPicker song={pickerSong} onClose={() => setPickerSong(null)} />}
    </>
  );
};
export default AlbumPage;
