import Topbar from "@/components/Topbar";
import { useMusicStore } from "@/stores/useMusicStore";
import { useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "react-router-dom";
import { Library } from "lucide-react";
import PlaylistSkeleton from "@/components/skeletons/PlaylistSkeleton";

const LibraryPage = () => {
  const { albums, fetchAlbums, isLoading } = useMusicStore();
  useEffect(() => { fetchAlbums(); }, [fetchAlbums]);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <Topbar />
      <ScrollArea className="flex-1">
        <div className="p-5 sm:p-6 fade-up">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 btn-gradient rounded-xl flex items-center justify-center glow-sm shrink-0">
              <Library className="size-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Library</h1>
              <p className="text-sm text-white/35">{albums.length} albums</p>
            </div>
          </div>

          {isLoading ? (
            <PlaylistSkeleton />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {albums.map((album) => (
                <Link key={album._id} to={`/albums/${album._id}`}
                  className="group rounded-2xl overflow-hidden transition-all hover:scale-[1.03] cursor-pointer"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="relative aspect-square">
                    <img src={album.imageUrl} alt={album.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="p-3">
                    <p className="font-semibold text-sm text-white/82 truncate group-hover:text-white transition-colors">{album.title}</p>
                    <p className="text-xs text-white/35 truncate">{album.artist} · {album.releaseYear}</p>
                    <p className="text-[11px] text-white/22 mt-0.5">{album.songs.length} songs</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
export default LibraryPage;
