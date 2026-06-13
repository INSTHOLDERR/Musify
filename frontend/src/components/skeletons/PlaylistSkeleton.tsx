const PlaylistSkeleton = () =>
  Array.from({ length: 6 }).map((_, i) => (
    <div key={i} className="flex items-center gap-2.5 p-2 rounded-xl animate-pulse">
      <div className="size-9 bg-white/6 rounded-lg shrink-0" />
      <div className="space-y-1.5 flex-1">
        <div className="h-2.5 bg-white/5 rounded-full w-3/4" />
        <div className="h-2 bg-white/4 rounded-full w-1/2" />
      </div>
    </div>
  ));
export default PlaylistSkeleton;
