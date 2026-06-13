import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatStore } from "@/stores/useChatStore";
import { useUser } from "@clerk/clerk-react";
import { Headphones } from "lucide-react";
import { useEffect } from "react";

const FriendsActivity = () => {
  const { users, fetchUsers, onlineUsers, userActivities } = useChatStore();
  const { user } = useUser();
  useEffect(() => { if (user) fetchUsers(); }, [fetchUsers, user]);

  const online = users.filter(u => onlineUsers.has(u.clerkId));
  const offline = users.filter(u => !onlineUsers.has(u.clerkId));

  return (
    <aside className="w-[200px] shrink-0 glass rounded-2xl flex flex-col overflow-hidden mb-2">
      <div className="px-4 py-3.5 border-b border-white/6 shrink-0">
        <div className="flex items-center gap-2">
          <Headphones className="size-3.5 text-purple-400" />
          <span className="text-[10px] font-semibold uppercase tracking-widest text-white/35">Activity</span>
          {onlineUsers.size > 0 && (
            <span className="ml-auto text-[9px] bg-emerald-500/15 text-emerald-400 px-1.5 py-0.5 rounded-full font-medium">
              {onlineUsers.size} online
            </span>
          )}
        </div>
      </div>

      {!user ? (
        <div className="flex-1 flex flex-col items-center justify-center p-5 text-center">
          <div className="w-10 h-10 rounded-2xl btn-gradient flex items-center justify-center mb-3 glow-sm">
            <Headphones className="size-5 text-white" />
          </div>
          <p className="text-xs text-white/35 leading-relaxed">Sign in to see friends' activity</p>
        </div>
      ) : (
        <ScrollArea className="flex-1">
          <div className="p-2.5 space-y-3">
            {online.length > 0 && (
              <div>
                <p className="text-[9px] uppercase tracking-widest text-white/20 font-semibold px-1.5 mb-1.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />Online
                </p>
                {online.map(u => <UserRow key={u._id} u={u} activity={userActivities.get(u.clerkId)} isOnline />)}
              </div>
            )}
            {offline.length > 0 && (
              <div>
                <p className="text-[9px] uppercase tracking-widest text-white/20 font-semibold px-1.5 mb-1.5">Offline</p>
                {offline.map(u => <UserRow key={u._id} u={u} activity={undefined} isOnline={false} />)}
              </div>
            )}
            {users.length === 0 && (
              <p className="text-xs text-white/20 text-center py-6">No other users yet</p>
            )}
          </div>
        </ScrollArea>
      )}
    </aside>
  );
};

const UserRow = ({ u, activity, isOnline }: any) => {
  const isPlaying = activity && activity !== "Idle";
  return (
    <div className="flex items-start gap-2 p-2 rounded-xl hover:bg-white/4 transition-colors cursor-pointer group">
      <div className="relative shrink-0">
        <Avatar className="size-8">
          <AvatarImage src={u.imageUrl} />
          <AvatarFallback className="bg-purple-900/50 text-purple-200 text-[10px]">{u.fullName[0]}</AvatarFallback>
        </Avatar>
        <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#0a0a14] ${isOnline ? "bg-emerald-400" : "bg-white/15"}`} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-1">
          <span className="text-xs font-medium text-white/70 truncate">{u.fullName.split(" ")[0]}</span>
          {isPlaying && (
            <div className="flex items-end gap-[2px] shrink-0" style={{ height: 12 }}>
              <span className="bar" style={{ height: 7 }} />
              <span className="bar" style={{ height: 12 }} />
              <span className="bar" style={{ height: 5 }} />
              <span className="bar" style={{ height: 9 }} />
            </div>
          )}
        </div>
        {isPlaying ? (
          <p className="text-[10px] text-white/30 truncate mt-0.5">{activity.replace("Playing ", "").split(" by ")[0]}</p>
        ) : (
          <p className="text-[10px] text-white/18 mt-0.5">{isOnline ? "Idle" : "Offline"}</p>
        )}
      </div>
    </div>
  );
};
export default FriendsActivity;
