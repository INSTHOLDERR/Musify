import { AdminTab } from "../AdminPage";
import { Disc3, Home, LayoutDashboard, Music2, Users2 } from "lucide-react";
import { Link } from "react-router-dom";
import { UserButton } from "@clerk/clerk-react";
import { cn } from "@/lib/utils";

const navItems: { id: AdminTab; label: string; icon: React.ElementType; desc: string }[] = [
  { id: "overview", label: "Overview",  icon: LayoutDashboard, desc: "Dashboard & stats" },
  { id: "songs",    label: "Songs",     icon: Music2,          desc: "Manage tracks" },
  { id: "albums",   label: "Albums",    icon: Disc3,           desc: "Manage albums" },
  { id: "users",    label: "Users",     icon: Users2,          desc: "View all users" },
];

const AdminSidebar = ({ activeTab, setActiveTab }: { activeTab: AdminTab; setActiveTab: (t: AdminTab) => void }) => (
  <aside className="w-[220px] shrink-0 flex flex-col h-full glass border-r border-white/5">
    {/* Brand */}
    <div className="p-5 border-b border-white/5 shrink-0">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="absolute inset-0 bg-purple-500 blur-md rounded-xl opacity-55" />
          <div className="relative btn-gradient rounded-xl p-2"><Music2 className="size-4 text-white" /></div>
        </div>
        <div>
          <p className="font-bold text-sm text-white">Musiffy</p>
          <p className="text-[10px] text-purple-400/65 font-medium">Admin Studio</p>
        </div>
      </div>
    </div>

    {/* Nav */}
    <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
      <p className="text-[9px] uppercase tracking-widest text-white/18 font-semibold px-3 mb-3 mt-1">Navigation</p>
      {navItems.map(({ id, label, icon: Icon, desc }) => (
        <button key={id} onClick={() => setActiveTab(id)}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all group",
            activeTab === id
              ? "bg-gradient-to-r from-purple-500/20 to-pink-500/10 border border-purple-500/22 text-white"
              : "text-white/38 hover:text-white/65 hover:bg-white/4 border border-transparent"
          )}>
          <div className={cn("p-1.5 rounded-lg transition-all shrink-0",
            activeTab === id ? "bg-purple-500/20" : "bg-white/5 group-hover:bg-white/8")}>
            <Icon className={cn("size-3.5", activeTab === id ? "text-purple-300" : "text-white/38 group-hover:text-white/55")} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium truncate">{label}</p>
            <p className={cn("text-[10px] truncate", activeTab === id ? "text-purple-400/55" : "text-white/22")}>{desc}</p>
          </div>
          {activeTab === id && <div className="w-1 h-5 rounded-full bg-gradient-to-b from-purple-400 to-pink-400 shrink-0" />}
        </button>
      ))}
    </nav>

    {/* Footer */}
    <div className="p-4 border-t border-white/5 space-y-3 shrink-0">
      <Link to="/" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-white/32 hover:text-white/55 hover:bg-white/4 transition-all text-sm">
        <Home className="size-3.5 shrink-0" /><span>Back to App</span>
      </Link>
      <div className="flex items-center gap-3 px-1">
        <UserButton />
        <div>
          <p className="text-xs font-medium text-white/55">Admin</p>
          <p className="text-[10px] text-white/22">Full access</p>
        </div>
      </div>
    </div>
  </aside>
);
export default AdminSidebar;
