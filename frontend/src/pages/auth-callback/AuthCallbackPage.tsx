import { axiosInstance } from "@/lib/axios";
import { useUser } from "@clerk/clerk-react";
import { Music2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const AuthCallbackPage = () => {
  const { isLoaded, user } = useUser();
  const navigate = useNavigate();
  const attempted = useRef(false);

  useEffect(() => {
    const sync = async () => {
      if (!isLoaded || !user || attempted.current) return;
      attempted.current = true;
      try {
        await axiosInstance.post("/auth/callback", {
          id: user.id, firstName: user.firstName,
          lastName: user.lastName, imageUrl: user.imageUrl,
        });
      } catch (e) { console.log("Auth callback error", e); }
      finally { navigate("/"); }
    };
    sync();
  }, [isLoaded, user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a14" }}>
      <div className="glass rounded-2xl p-10 flex flex-col items-center gap-5 fade-up">
        <div className="relative">
          <div className="absolute inset-0 bg-purple-500 blur-xl rounded-full opacity-45 animate-pulse" />
          <div className="relative btn-gradient rounded-2xl p-4 glow">
            <Music2 className="size-8 text-white" style={{ animation: "spin 3s linear infinite" }} />
          </div>
        </div>
        <div className="text-center">
          <p className="font-semibold text-white/75">Signing you in</p>
          <p className="text-sm text-white/32 mt-1">Just a moment…</p>
        </div>
      </div>
    </div>
  );
};
export default AuthCallbackPage;
