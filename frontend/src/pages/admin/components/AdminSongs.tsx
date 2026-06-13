import { useMusicStore } from "@/stores/useMusicStore";
import { useState, useMemo } from "react";
import { Clock, Music2, Search, Trash2, ChevronDown } from "lucide-react";
import AddSongDialog from "./AddSongDialog";

const fmt = (s: number) => {
  if (!s || isNaN(s)) return "0:00";
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
};

// Detect language from artist/title heuristically
const detectLang = (title: string, artist: string): string => {
  const text = `${title} ${artist}`.toLowerCase();
  // Malayalam / South Indian artists check
  const malayalamArtists = ["arijit", "shreya", "kk", "sp balasubrahmanyam", "k s chithra", "mg sreekumar",
    "vidyasagar", "ouseppachan", "johnson", "raveendran", "malayali", "malayalam"];
  const hindiKeywords = ["hindi", "bollywood", "kumar sanu", "lata", "kishore"];
  const tamilKeywords = ["tamil", "ar rahman", "ilayaraja", "harris jayaraj", "sid sriram"];
  const teluguKeywords = ["telugu", "s s thaman", "devi sri"];
  const englishKeywords = ["english", "pop", "rock", "taylor", "ed sheeran", "justin", "ariana"];

  if (malayalamArtists.some(k => text.includes(k))) return "Malayalam";
  if (hindiKeywords.some(k => text.includes(k))) return "Hindi";
  if (tamilKeywords.some(k => text.includes(k))) return "Tamil";
  if (teluguKeywords.some(k => text.includes(k))) return "Telugu";
  if (englishKeywords.some(k => text.includes(k))) return "English";
  // Check if text is ASCII (likely English) vs non-ASCII
  if (/[^\x00-\x7F]/.test(text)) return "Other";
  return "English";
};

const FilterChip = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
  <button onClick={onClick}
    className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
      active
        ? "bg-purple-500/25 text-purple-300 border border-purple-500/35"
        : "bg-white/5 text-white/40 border border-white/8 hover:bg-white/8 hover:text-white/60"
    }`}>
    {label}
  </button>
);

const AdminSongs = () => {
  const { songs, deleteSong, isLoading } = useMusicStore();
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [langFilter, setLangFilter] = useState<string>("All");
  const [artistFilter, setArtistFilter] = useState<string>("All");
  const [showArtistDrop, setShowArtistDrop] = useState(false);
  const [sortBy, setSortBy] = useState<"title" | "artist" | "duration">("title");

  // Derive unique artists and languages
  const artists = useMemo(() => {
    const set = new Set(songs.map(s => s.artist));
    return ["All", ...Array.from(set).sort()];
  }, [songs]);

  const languages = useMemo(() => {
    const set = new Set(songs.map(s => detectLang(s.title, s.artist)));
    return ["All", ...Array.from(set).sort()];
  }, [songs]);

  const filtered = useMemo(() => {
    let list = songs.filter(s =>
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.artist.toLowerCase().includes(search.toLowerCase())
    );
    if (langFilter !== "All") list = list.filter(s => detectLang(s.title, s.artist) === langFilter);
    if (artistFilter !== "All") list = list.filter(s => s.artist === artistFilter);
    list = [...list].sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "artist") return a.artist.localeCompare(b.artist);
      return a.duration - b.duration;
    });
    return list;
  }, [songs, search, langFilter, artistFilter, sortBy]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(id);
    await deleteSong(id);
    setDeleting(null);
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col p-6 gap-4 fade-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Music2 className="size-5 text-purple-400" />Songs Library
          </h1>
          <p className="text-sm text-white/28 mt-0.5">{songs.length} total tracks</p>
        </div>
        <AddSongDialog />
      </div>

      {/* Search + Sort */}
      <div className="flex gap-3 shrink-0">
        <div className="flex items-center gap-2 glass rounded-xl px-4 py-2.5 flex-1 max-w-sm">
          <Search className="size-3.5 text-white/22 shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by title or artist..."
            className="bg-transparent text-sm text-white/65 placeholder:text-white/18 outline-none flex-1" />
          {search && <button onClick={() => setSearch("")} className="text-white/25 hover:text-white/55 text-xs">✕</button>}
        </div>
        <select value={sortBy} onChange={e => setSortBy(e.target.value as any)}
          className="glass rounded-xl px-3 py-2.5 text-xs text-white/55 border border-white/8 outline-none bg-transparent cursor-pointer">
          <option value="title" className="bg-[#1a1a2e]">Sort: Title</option>
          <option value="artist" className="bg-[#1a1a2e]">Sort: Artist</option>
          <option value="duration" className="bg-[#1a1a2e]">Sort: Duration</option>
        </select>
      </div>

      {/* Language filter chips */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-[10px] text-white/22 uppercase tracking-widest font-semibold shrink-0">Language</span>
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
          {languages.map(l => (
            <FilterChip key={l} label={l} active={langFilter === l} onClick={() => setLangFilter(l)} />
          ))}
        </div>
      </div>

      {/* Artist filter */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-[10px] text-white/22 uppercase tracking-widest font-semibold shrink-0">Artist</span>
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar flex-1">
          {artists.slice(0, 6).map(a => (
            <FilterChip key={a} label={a} active={artistFilter === a} onClick={() => setArtistFilter(a)} />
          ))}
          {artists.length > 6 && (
            <div className="relative shrink-0">
              <button onClick={() => setShowArtistDrop(v => !v)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  artistFilter !== "All" && !artists.slice(0, 6).includes(artistFilter)
                    ? "bg-purple-500/25 text-purple-300 border-purple-500/35"
                    : "bg-white/5 text-white/40 border-white/8 hover:bg-white/8"
                }`}>
                More <ChevronDown className="size-3" />
              </button>
              {showArtistDrop && (
                <div className="absolute top-full mt-1 left-0 glass-dark rounded-xl border border-white/10 shadow-xl z-20 w-48 max-h-48 overflow-y-auto">
                  {artists.slice(6).map(a => (
                    <button key={a} onClick={() => { setArtistFilter(a); setShowArtistDrop(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        artistFilter === a ? "text-purple-300 bg-purple-500/10" : "text-white/55 hover:bg-white/5"
                      }`}>
                      {a}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-hidden glass rounded-2xl border border-white/5 flex flex-col">
        <div className="grid grid-cols-[44px_1fr_160px_90px_72px_44px] gap-3 px-5 py-3 border-b border-white/5 shrink-0 text-[10px] uppercase tracking-widest text-white/22 font-semibold">
          <span></span><span>Title</span><span>Artist</span><span>Album</span>
          <span className="flex items-center gap-1"><Clock className="size-3" />Dur</span><span></span>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="grid grid-cols-[44px_1fr_160px_90px_72px_44px] gap-3 px-5 py-3.5 border-b border-white/4 animate-pulse items-center">
              <div className="size-9 rounded-xl bg-white/6" />
              <div className="space-y-1.5"><div className="h-2.5 bg-white/6 rounded-full w-2/3" /><div className="h-2 bg-white/4 rounded-full w-1/3" /></div>
              <div className="h-2.5 bg-white/5 rounded-full w-3/4" />
              <div className="h-2.5 bg-white/4 rounded-full w-1/2" />
              <div className="h-2.5 bg-white/4 rounded-full w-2/3" />
              <div className="size-8 rounded-lg bg-white/4" />
            </div>
          )) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-white/18">
              <Music2 className="size-10 mb-3" />
              <p className="text-sm">{search ? "No songs match your search" : "No songs yet — add one!"}</p>
            </div>
          ) : filtered.map((song) => (
            <div key={song._id}
              className="grid grid-cols-[44px_1fr_160px_90px_72px_44px] gap-3 px-5 py-3 border-b border-white/4 hover:bg-white/3 transition-colors group items-center">
              <img src={song.imageUrl} className="size-9 rounded-xl object-cover ring-1 ring-white/8" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-white/82 truncate">{song.title}</p>
                <p className="text-[10px] text-white/22 truncate">{detectLang(song.title, song.artist)}</p>
              </div>
              <p className="text-sm text-white/48 truncate">{song.artist}</p>
              <p className="text-xs text-white/28 truncate">{song.albumId ? "In Album" : <span className="text-white/15 italic">Single</span>}</p>
              <p className="text-xs text-white/28">{fmt(song.duration)}</p>
              <button onClick={() => handleDelete(song._id, song.title)} disabled={deleting === song._id}
                className="opacity-0 group-hover:opacity-100 p-2 rounded-lg text-red-400/45 hover:text-red-300 hover:bg-red-400/10 transition-all disabled:opacity-25">
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ))}
        </div>

        <div className="px-5 py-2.5 border-t border-white/5 flex items-center justify-between shrink-0">
          <p className="text-xs text-white/18">{filtered.length} of {songs.length} songs</p>
          {(search || langFilter !== "All" || artistFilter !== "All") && (
            <button onClick={() => { setSearch(""); setLangFilter("All"); setArtistFilter("All"); }}
              className="text-xs text-purple-400/55 hover:text-purple-300 transition-colors">
              Clear filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export default AdminSongs;
