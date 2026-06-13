const UsersListSkeleton = () =>
  Array.from({ length: 5 }).map((_, i) => (
    <div key={i} className="flex items-center gap-2.5 p-2.5 rounded-xl animate-pulse">
      <div className="size-9 bg-white/6 rounded-full shrink-0" />
      <div className="flex-1 hidden sm:block space-y-1.5">
        <div className="h-2.5 bg-white/6 rounded-full w-2/3" />
        <div className="h-2 bg-white/4 rounded-full w-1/3" />
      </div>
    </div>
  ));
export default UsersListSkeleton;
