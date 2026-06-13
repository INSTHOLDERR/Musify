import { useAuthStore } from "@/stores/useAuthStore";
import { useMusicStore } from "@/stores/useMusicStore";
import { useEffect, useState } from "react";
import AdminSidebar from "./components/AdminSidebar";
import AdminOverview from "./components/AdminOverview";
import AdminSongs from "./components/AdminSongs";
import AdminAlbums from "./components/AdminAlbums";
import AdminUsers from "./components/AdminUsers";

export type AdminTab = "overview" | "songs" | "albums" | "users";

const AdminPage = () => {
  const { isAdmin, isLoading } = useAuthStore();
  const { fetchAlbums, fetchSongs, fetchStats } = useMusicStore();
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");

  useEffect(() => { fetchAlbums(); fetchSongs(); fetchStats(); }, [fetchAlbums, fetchSongs, fetchStats]);

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a14" }}>
      <div className="spinner" style={{ width: 32, height: 32 }} />
    </div>
  );

  if (!isAdmin) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a14" }}>
      <div className="glass rounded-2xl p-10 text-center space-y-4 max-w-sm mx-4 fade-up">
        <div className="text-5xl">🔒</div>
        <h2 className="text-lg font-bold text-white/80">Access Denied</h2>
        <p className="text-sm text-white/35">You need admin permissions to view this page.</p>
        <a href="/" className="btn-gradient inline-block mt-2 px-6 py-2.5 rounded-xl text-sm font-semibold glow-sm">← Go Home</a>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#0a0a14" }}>
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-hidden flex flex-col">
        {activeTab === "overview" && <AdminOverview setActiveTab={setActiveTab} />}
        {activeTab === "songs"    && <AdminSongs />}
        {activeTab === "albums"   && <AdminAlbums />}
        {activeTab === "users"    && <AdminUsers />}
      </main>
    </div>
  );
};
export default AdminPage;
