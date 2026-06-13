import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";

const updateApiToken = (token: string | null) => {
  if (token) axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete axiosInstance.defaults.headers.common["Authorization"];
};

const BlockedScreen = () => (
  <div className="h-screen flex items-center justify-center" style={{ background: "#0a0a14" }}>
    <div className="text-center max-w-sm px-6">
      <div className="w-16 h-16 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center mx-auto mb-5">
        <svg className="size-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-white mb-2">Account Blocked</h2>
      <p className="text-white/45 text-sm leading-relaxed">
        Your account has been blocked by an administrator. You cannot access Musiffy at this time.
      </p>
      <p className="text-white/25 text-xs mt-4">If you believe this is a mistake, please contact support.</p>
    </div>
  </div>
);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { getToken, userId } = useAuth();
  const [loading, setLoading] = useState(true);
  const { checkAdminStatus, isBlocked } = useAuthStore();
  const { initSocket, disconnectSocket } = useChatStore();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = await getToken();
        updateApiToken(token);
        if (token) {
          await checkAdminStatus();
          if (userId) initSocket(userId);
        }
      } catch (error) {
        updateApiToken(null);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
    return () => disconnectSocket();
  }, [getToken, userId, checkAdminStatus, initSocket, disconnectSocket]);

  if (loading) return (
    <div className="h-screen flex items-center justify-center" style={{ background: "#0a0a14" }}>
      <div className="relative">
        <div className="absolute inset-0 bg-purple-500 blur-xl rounded-full opacity-40 animate-pulse" />
        <div className="spinner relative" style={{ width: 32, height: 32 }} />
      </div>
    </div>
  );

  if (isBlocked) return <BlockedScreen />;

  return <>{children}</>;
};
export default AuthProvider;
