import { HomeIcon, Music2 } from "lucide-react";
import { Link } from "react-router-dom";

const NotFoundPage = () => (
  <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "#0a0a14" }}>
    <div className="text-center space-y-5 fade-up">
      <div className="relative mx-auto w-fit">
        <div className="absolute -inset-5 bg-gradient-to-r from-purple-600/25 to-pink-600/25 rounded-full blur-2xl" />
        <div className="relative glass rounded-3xl p-7">
          <Music2 className="size-14 text-purple-300" />
        </div>
      </div>
      <div>
        <h1 className="text-8xl font-black gradient-text leading-none mb-2">404</h1>
        <p className="text-white/42 text-sm">This track doesn't exist.</p>
      </div>
      <Link to="/" className="btn-gradient inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold glow">
        <HomeIcon className="size-3.5" />Back to Home
      </Link>
    </div>
  </div>
);
export default NotFoundPage;
