const SectionGridSkeleton = () => (
  <div>
    <div className="h-4 w-36 bg-white/6 rounded-lg mb-3 animate-pulse" />
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="rounded-2xl p-3 animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }}>
          <div className="aspect-square rounded-xl bg-white/6 mb-3" />
          <div className="h-2.5 bg-white/6 rounded-full w-3/4 mb-2" />
          <div className="h-2 bg-white/4 rounded-full w-1/2" />
        </div>
      ))}
    </div>
  </div>
);
export default SectionGridSkeleton;
