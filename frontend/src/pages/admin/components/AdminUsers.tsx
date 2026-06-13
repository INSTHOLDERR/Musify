import { axiosInstance } from "@/lib/axios";
import { useEffect, useState } from "react";
import { Search, Users2, ShieldOff, Shield } from "lucide-react";
import toast from "react-hot-toast";

interface AdminUser {
  _id: string; clerkId: string; fullName: string;
  imageUrl: string; email?: string; role: string; createdAt: string; isBlocked?: boolean;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [blocking, setBlocking] = useState<string | null>(null);

  useEffect(() => {
    axiosInstance.get("/admin/users")
      .then(r => setUsers(r.data))
      .catch(e => console.error("Failed to fetch users", e))
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(u =>
    u.fullName.toLowerCase().includes(search.toLowerCase()) ||
    (u.email ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const toggleBlock = async (user: AdminUser) => {
    setBlocking(user._id);
    try {
      const res = await axiosInstance.patch(`/admin/users/${user._id}/block`);
      setUsers(prev => prev.map(u => u._id === user._id ? { ...u, isBlocked: res.data.isBlocked } : u));
      toast.success(res.data.message);
    } catch {
      toast.error("Failed to update user");
    } finally {
      setBlocking(null);
    }
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col p-6 gap-4 fade-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Users2 className="size-5 text-amber-400" />User Management
          </h1>
          <p className="text-sm text-white/28 mt-0.5">{users.length} registered users</p>
        </div>
      </div>

      <div className="flex items-center gap-2 glass rounded-xl px-4 py-2.5 max-w-sm shrink-0">
        <Search className="size-3.5 text-white/22 shrink-0" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..."
          className="bg-transparent text-sm text-white/65 placeholder:text-white/18 outline-none flex-1" />
        {search && <button onClick={() => setSearch("")} className="text-white/25 hover:text-white/55 text-xs">✕</button>}
      </div>

      <div className="flex-1 overflow-hidden glass rounded-2xl border border-white/5 flex flex-col">
        <div className="grid grid-cols-[44px_1fr_120px_72px_90px_80px] gap-3 px-5 py-3 border-b border-white/5 shrink-0 text-[10px] uppercase tracking-widest text-white/22 font-semibold">
          <span></span><span>User</span><span>Email</span><span>Role</span><span>Joined</span><span>Action</span>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="grid grid-cols-[44px_1fr_120px_72px_90px_80px] gap-3 px-5 py-3.5 border-b border-white/4 animate-pulse items-center">
                <div className="size-9 rounded-full bg-white/6" />
                <div className="space-y-1.5"><div className="h-2.5 bg-white/6 rounded-full w-1/2" /><div className="h-2 bg-white/4 rounded-full w-1/3" /></div>
                <div className="h-2.5 bg-white/5 rounded-full w-3/4" />
                <div className="h-5 bg-white/4 rounded-full w-12" />
                <div className="h-2.5 bg-white/4 rounded-full w-2/3" />
                <div className="h-7 bg-white/4 rounded-xl w-16" />
              </div>
            ))
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-white/18">
              <Users2 className="size-10 mb-3" />
              <p className="text-sm">{search ? "No users match your search" : "No users yet"}</p>
            </div>
          ) : (
            filtered.map(user => (
              <div key={user._id}
                className={`grid grid-cols-[44px_1fr_120px_72px_90px_80px] gap-3 px-5 py-3.5 border-b border-white/4 transition-colors items-center
                  ${user.isBlocked ? "bg-red-500/5" : "hover:bg-white/3"}`}>
                <div className="relative">
                  <img src={user.imageUrl} alt={user.fullName} className={`size-9 rounded-full object-cover ring-1 ${user.isBlocked ? "ring-red-500/30 opacity-60" : "ring-white/10"}`} />
                  {user.role === "admin" && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full btn-gradient flex items-center justify-center">
                      <span className="text-[7px] text-white font-bold">A</span>
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className={`text-sm font-medium truncate ${user.isBlocked ? "text-red-300/60" : "text-white/82"}`}>{user.fullName}</p>
                  <p className="text-[10px] text-white/22 font-mono truncate">{user.clerkId.slice(0, 16)}…</p>
                </div>
                <p className="text-xs text-white/38 truncate">{user.email ?? <span className="text-white/15 italic">—</span>}</p>
                <div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    user.role === "admin"
                      ? "bg-purple-500/18 text-purple-300 border border-purple-500/22"
                      : "bg-white/5 text-white/32 border border-white/8"
                  }`}>{user.role}</span>
                </div>
                <p className="text-xs text-white/22">{user.createdAt?.split("T")[0]}</p>
                <div>
                  {user.role !== "admin" && (
                    <button
                      onClick={() => toggleBlock(user)}
                      disabled={blocking === user._id}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all disabled:opacity-50
                        ${user.isBlocked
                          ? "bg-green-500/15 text-green-300 border border-green-500/20 hover:bg-green-500/25"
                          : "bg-red-500/12 text-red-300 border border-red-500/18 hover:bg-red-500/22"
                        }`}>
                      {blocking === user._id ? (
                        <span className="w-3 h-3 rounded-full border border-current border-t-transparent animate-spin" />
                      ) : user.isBlocked ? (
                        <><Shield className="size-3" />Unblock</>
                      ) : (
                        <><ShieldOff className="size-3" />Block</>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="px-5 py-2.5 border-t border-white/5 flex items-center justify-between shrink-0">
          <p className="text-xs text-white/18">{filtered.length} of {users.length} users</p>
          {search && <button onClick={() => setSearch("")} className="text-xs text-purple-400/55 hover:text-purple-300 transition-colors">Clear filter</button>}
        </div>
      </div>
    </div>
  );
};
export default AdminUsers;
