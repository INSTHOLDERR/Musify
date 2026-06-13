import { Input } from "@/components/ui/input";
import { useChatStore } from "@/stores/useChatStore";
import { useUser } from "@clerk/clerk-react";
import { Send } from "lucide-react";
import { useState } from "react";

const MessageInput = () => {
  const [msg, setMsg] = useState("");
  const { user } = useUser();
  const { selectedUser, sendMessage } = useChatStore();

  const send = () => {
    if (!msg.trim() || !user || !selectedUser) return;
    sendMessage(selectedUser.clerkId, user.id, msg.trim());
    setMsg("");
  };

  return (
    <div className="flex gap-2 p-4">
      <Input value={msg} onChange={e => setMsg(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
        placeholder="Type a message..."
        className="flex-1 bg-white/5 border-white/8 text-white/82 placeholder:text-white/18 rounded-xl focus:border-purple-500/40" />
      <button onClick={send} disabled={!msg.trim()}
        className="btn-gradient rounded-xl w-10 h-10 flex items-center justify-center shrink-0 glow-sm">
        <Send className="size-4 text-white" />
      </button>
    </div>
  );
};
export default MessageInput;
