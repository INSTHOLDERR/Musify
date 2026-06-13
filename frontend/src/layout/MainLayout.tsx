import { Outlet } from "react-router-dom";
import LeftSidebar from "./components/LeftSidebar";
import FriendsActivity from "./components/FriendsActivity";
import AudioPlayer from "./components/AudioPlayer";
import { PlaybackControls } from "./components/PlaybackControls";
import MobileNav from "./components/MobileNav";
import { useEffect, useState } from "react";

const MainLayout = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  return (
    <div className="flex flex-col h-screen" style={{ background: "#0a0a14" }}>
      <AudioPlayer />
      {isMobile ? (
        <div className="flex-1 overflow-hidden">
          <Outlet />
        </div>
      ) : (
        <div className="flex flex-1 overflow-hidden gap-2 p-2 pb-0">
          <LeftSidebar />
          <main className="flex-1 overflow-hidden rounded-2xl glass">
            <Outlet />
          </main>
          <FriendsActivity />
        </div>
      )}
      <PlaybackControls />
      {isMobile && <MobileNav />}
    </div>
  );
};
export default MainLayout;
