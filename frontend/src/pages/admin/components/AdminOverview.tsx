import { useMusicStore } from "@/stores/useMusicStore";
import { AdminTab } from "../AdminPage";
import { ArrowRight, Disc3, Music2, TrendingUp, Users2 } from "lucide-react";

const AdminOverview = ({ setActiveTab }: { setActiveTab: (t: AdminTab) => void }) => {
  const { stats, songs, albums } = useMusicStore();
  const recentSongs  = [...songs].slice(0, 5);
  const recentAlbums = [...albums].slice(0, 4);

  const statCards = [
    { label: "Total Songs",   value: stats.totalSongs,   icon: Music2,     color: "#9333ea", tab: "songs"  as AdminTab },
    { label: "Total Albums",  value: stats.totalAlbums,  icon: Disc3,      color: "#ec4899", tab: "albums" as AdminTab },
    { label: "Total Artists", value: stats.totalArtists, icon: TrendingUp, color: "#06b6d4", tab: "songs"  as AdminTab },
    { label: "Total Users",   value: stats.totalUsers,   icon: Users2,     color: "#f59e0b", tab: "users"  as AdminTab },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 fade-up">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-white/32 mt-0.5">Welcome back, Admin.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color, tab }) => (
          <button key={label} onClick={() => setActiveTab(tab)}
            className="glass rounded-2xl p-5 text-left hover:scale-[1.02] transition-all group border border-white/5 hover:border-white/10">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2.5 rounded-xl" style={{ background: `${color}15`, border: `1px solid ${color}28` }}>
                <Icon className="size-5" style={{ color }} />
              </div>
              <ArrowRight className="size-3.5 text-white/18 group-hover:text-white/45 group-hover:translate-x-0.5 transition-all" />
            </div>
            <p className="text-3xl font-black text-white mb-0.5">{value?.toLocaleString() ?? 0}</p>
            <p className="text-xs text-white/32 font-medium">{label}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Songs */}
        <div className="glass rounded-2xl overflow-hidden border border-white/5">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
            <div className="flex items-center gap-2">
              <Music2 className="size-3.5 text-purple-400" />
              <h3 className="font-semibold text-sm text-white/82">Recent Songs</h3>
            </div>
            <button onClick={() => setActiveTab("songs")}
              className="text-[11px] text-purple-400/55 hover:text-purple-300 transition-colors flex items-center gap-1">
              View all <ArrowRight className="size-3" />
            </button>
          </div>
          <div className="divide-y divide-white/4">
            {recentSongs.length === 0
              ? <p className="text-center text-white/18 text-sm py-8">No songs yet</p>
              : recentSongs.map((song, i) => (
                <div key={song._id} className="flex items-center gap-3 px-5 py-3 hover:bg-white/3 transition-colors">
                  <span className="text-xs text-white/18 w-4 text-center shrink-0">{i + 1}</span>
                  <img src={song.imageUrl} className="size-9 rounded-lg object-cover ring-1 ring-white/8 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white/82 truncate">{song.title}</p>
                    <p className="text-xs text-white/32 truncate">{song.artist}</p>
                  </div>
                  <span className="text-[10px] text-white/18 shrink-0">{song.createdAt?.split("T")[0]}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Recent Albums */}
        <div className="glass rounded-2xl overflow-hidden border border-white/5">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
            <div className="flex items-center gap-2">
              <Disc3 className="size-3.5 text-pink-400" />
              <h3 className="font-semibold text-sm text-white/82">Recent Albums</h3>
            </div>
            <button onClick={() => setActiveTab("albums")}
              className="text-[11px] text-purple-400/55 hover:text-purple-300 transition-colors flex items-center gap-1">
              View all <ArrowRight className="size-3" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3 p-4">
            {recentAlbums.length === 0
              ? <p className="col-span-2 text-center text-white/18 text-sm py-8">No albums yet</p>
              : recentAlbums.map((album) => (
                <div key={album._id} className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-white/4 transition-colors border border-white/5">
                  <img src={album.imageUrl} className="size-10 rounded-lg object-cover ring-1 ring-white/8 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white/78 truncate">{album.title}</p>
                    <p className="text-[10px] text-white/28 truncate">{album.artist}</p>
                    <p className="text-[10px] text-purple-400/45">{album.songs?.length ?? 0} tracks</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminOverview;
