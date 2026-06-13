import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatStore } from "@/stores/useChatStore";
import UsersListSkeleton from "@/components/skeletons/UsersListSkeleton";

const UsersList = () => {
  const { users, selectedUser, isLoading, setSelectedUser, onlineUsers } = useChatStore();
  return (
    <div className="w-[70px] sm:w-[220px] border-r border-white/5 flex flex-col shrink-0">
      <div className="px-3 sm:px-4 py-3 border-b border-white/5 shrink-0">
        <p className="hidden sm:block text-[10px] uppercase tracking-widest text-white/22 font-semibold">Conversations</p>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-0.5">
          {isLoading ? <UsersListSkeleton /> : users.map(u => {
            const isOnline = onlineUsers.has(u.clerkId);
            const selected = selectedUser?.clerkId === u.clerkId;
            return (
              <div key={u._id} onClick={() => setSelectedUser(u)}
                className={`flex items-center gap-2.5 px-2 py-2.5 rounded-xl cursor-pointer transition-all
                  ${selected ? "bg-purple-500/15 border border-purple-500/20" : "hover:bg-white/4 border border-transparent"}`}>
                <div className="relative shrink-0">
                  <Avatar className="size-9">
                    <AvatarImage src={u.imageUrl} />
                    <AvatarFallback className="bg-purple-900/50 text-purple-200 text-xs">{u.fullName[0]}</AvatarFallback>
                  </Avatar>
                  <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#0a0a14] ${isOnline ? "bg-emerald-400" : "bg-white/15"}`} />
                </div>
                <div className="hidden sm:block min-w-0">
                  <p className={`text-sm font-medium truncate ${selected ? "text-purple-300" : "text-white/72"}`}>{u.fullName}</p>
                  <p className={`text-xs ${isOnline ? "text-emerald-400/65" : "text-white/22"}`}>{isOnline ? "Online" : "Offline"}</p>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};
export default UsersList;
