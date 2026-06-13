const FeaturedGridSkeleton = () => (
  <div>
    <div className="h-4 w-24 bg-white/6 rounded-lg mb-3 animate-pulse" />
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-2xl p-3 flex gap-3 items-center animate-pulse"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="w-14 h-14 rounded-xl bg-white/6 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-2.5 bg-white/6 rounded-full w-3/4" />
            <div className="h-2 bg-white/4 rounded-full w-1/2" />
          </div>
        </div>
      ))}
    </div>
  </div>
);
export default FeaturedGridSkeleton;
