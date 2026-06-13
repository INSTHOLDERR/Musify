import { Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import { Toaster } from "react-hot-toast";

const HomePage          = lazy(() => import("./pages/home/HomePage"));
const ChatPage          = lazy(() => import("./pages/chat/ChatPage"));
const AlbumPage         = lazy(() => import("./pages/album/AlbumPage"));
const AdminPage         = lazy(() => import("./pages/admin/AdminPage"));
const AuthCallbackPage  = lazy(() => import("./pages/auth-callback/AuthCallbackPage"));
const NotFoundPage      = lazy(() => import("./pages/404/NotFoundPage"));
const MainLayout        = lazy(() => import("./layout/MainLayout"));
const MusicPage         = lazy(() => import("./pages/music/MusicPage"));
const WishlistPage      = lazy(() => import("./pages/wishlist/WishlistPage"));
const LibraryPage       = lazy(() => import("./pages/library/LibraryPage"));

function App() {
  return (
    <>
      <Suspense fallback={
        <div className="h-screen flex items-center justify-center" style={{ background: "#0a0a14" }}>
          <div className="spinner" />
        </div>
      }>
        <Routes>
          <Route path="/sso-callback" element={<AuthenticateWithRedirectCallback signUpForceRedirectUrl="/auth-callback" />} />
          <Route path="/auth-callback" element={<AuthCallbackPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/music" element={<MusicPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/albums/:albumId" element={<AlbumPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
      <Toaster position="bottom-right" toastOptions={{ style: { background: "#1a1a2e", color: "#e2e8f0", border: "1px solid rgba(147,51,234,0.3)" } }} />
    </>
  );
}
export default App;
