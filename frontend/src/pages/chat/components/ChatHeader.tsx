import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useChatStore } from "@/stores/useChatStore";

const ChatHeader = () => {
  const { selectedUser, onlineUsers } = useChatStore();
  if (!selectedUser) return null;
  const online = onlineUsers.has(selectedUser.clerkId);
  return (
    <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/5 shrink-0">
      <div className="relative">
        <Avatar className="size-9 ring-1 ring-white/8">
          <AvatarImage src={selectedUser.imageUrl} />
          <AvatarFallback className="bg-purple-900/50 text-purple-200 text-xs">{selectedUser.fullName[0]}</AvatarFallback>
        </Avatar>
        <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#0a0a14] ${online ? "bg-emerald-400" : "bg-white/15"}`} />
      </div>
      <div>
        <p className="font-semibold text-sm text-white/88">{selectedUser.fullName}</p>
        <p className={`text-xs ${online ? "text-emerald-400/65" : "text-white/28"}`}>{online ? "Active now" : "Offline"}</p>
      </div>
    </div>
  );
};
export default ChatHeader;
