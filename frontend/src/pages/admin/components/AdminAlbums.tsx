import { useMusicStore } from "@/stores/useMusicStore";
import { useState } from "react";
import { Disc3, Music2, Search, Trash2 } from "lucide-react";
import AddAlbumDialog from "./AddAlbumDialog";

const AdminAlbums = () => {
  const { albums, deleteAlbum, isLoading } = useMusicStore();
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  const filtered = albums.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.artist.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete album "${title}"? This will also delete all its songs!`)) return;
    setDeleting(id); await deleteAlbum(id); setDeleting(null);
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col p-6 gap-4 fade-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Disc3 className="size-5 text-pink-400" />Albums Library
          </h1>
          <p className="text-sm text-white/28 mt-0.5">{albums.length} total albums</p>
        </div>
        <AddAlbumDialog />
      </div>

      <div className="flex items-center gap-2 glass rounded-xl px-4 py-2.5 max-w-sm shrink-0">
        <Search className="size-3.5 text-white/22 shrink-0" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by title or artist..."
          className="bg-transparent text-sm text-white/65 placeholder:text-white/18 outline-none flex-1" />
        {search && <button onClick={() => setSearch("")} className="text-white/25 hover:text-white/55 text-xs">✕</button>}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="glass rounded-2xl p-3 border border-white/5 animate-pulse">
              <div className="aspect-square rounded-xl bg-white/6 mb-3" />
              <div className="h-2.5 bg-white/6 rounded-full w-3/4 mb-2" />
              <div className="h-2 bg-white/4 rounded-full w-1/2" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-white/18">
          <Disc3 className="size-12 mb-3" />
          <p className="text-sm">{search ? "No albums match your search" : "No albums yet — create one!"}</p>
        </div>
      ) : (
        <div className="overflow-y-auto flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-4">
            {filtered.map((album) => (
              <div key={album._id}
                className="glass rounded-2xl overflow-hidden border border-white/5 hover:border-white/10 group transition-all hover:scale-[1.01]">
                <div className="relative aspect-square overflow-hidden">
                  <img src={album.imageUrl} alt={album.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <button onClick={() => handleDelete(album._id, album.title)} disabled={deleting === album._id}
                    className="absolute top-2.5 right-2.5 p-2 rounded-xl bg-red-500/18 border border-red-500/28 text-red-300 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/30 disabled:opacity-25">
                    <Trash2 className="size-3.5" />
                  </button>
                  <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 px-2 py-1 rounded-lg" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}>
                    <Music2 className="size-2.5 text-purple-300" />
                    <span className="text-[10px] text-white/65 font-medium">{album.songs?.length ?? 0} tracks</span>
                  </div>
                </div>
                <div className="p-3.5">
                  <p className="font-semibold text-sm text-white/88 truncate">{album.title}</p>
                  <p className="text-xs text-white/38 truncate mt-0.5">{album.artist}</p>
                  <div className="flex items-center justify-between mt-2.5">
                    <span className="text-[10px] text-white/18 bg-white/5 px-2 py-0.5 rounded-full">{album.releaseYear}</span>
                    <div className="flex gap-0.5">
                      {Array.from({ length: Math.min(3, album.songs?.length ?? 0) }).map((_, i) =>
                        album.songs?.[i] && (
                          <img key={i} src={album.songs[i].imageUrl} className="size-5 rounded object-cover ring-1 ring-white/10" />
                        )
                      )}
                      {(album.songs?.length ?? 0) > 3 && (
                        <div className="size-5 rounded flex items-center justify-center text-[9px] text-white/38" style={{ background: "rgba(255,255,255,0.07)" }}>
                          +{(album.songs?.length ?? 0) - 3}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-xs text-white/18 shrink-0">
        {filtered.length} of {albums.length} albums
        {search && <> · <button onClick={() => setSearch("")} className="text-purple-400/55 hover:text-purple-300 transition-colors">Clear filter</button></>}
      </p>
    </div>
  );
};
export default AdminAlbums;
