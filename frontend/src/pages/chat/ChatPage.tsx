import Topbar from "@/components/Topbar";
import { useChatStore } from "@/stores/useChatStore";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useRef } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import MessageInput from "./components/MessageInput";
import ChatHeader from "./components/ChatHeader";
import UsersList from "./components/UsersList";
import { MessageSquare } from "lucide-react";

const fmt = (d: string) => new Date(d).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

const ChatPage = () => {
  const { user } = useUser();
  const { messages, selectedUser, fetchUsers, fetchMessages } = useChatStore();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (user) fetchUsers(); }, [user, fetchUsers]);
  useEffect(() => { if (selectedUser) fetchMessages(selectedUser.clerkId); }, [selectedUser, fetchMessages]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <Topbar />
      <div className="flex-1 flex overflow-hidden">
        <UsersList />
        <div className="flex-1 flex flex-col overflow-hidden">
          {selectedUser ? (
            <>
              <ChatHeader />
              <ScrollArea className="flex-1 px-4 py-3">
                <div className="space-y-3 max-w-2xl mx-auto">
                  {messages.map((msg) => {
                    const mine = msg.senderId === user?.id;
                    return (
                      <div key={msg._id} className={`flex gap-2.5 ${mine ? "flex-row-reverse" : ""}`}>
                        <Avatar className="size-7 shrink-0 self-end ring-1 ring-white/8">
                          <AvatarImage src={mine ? user?.imageUrl : selectedUser.imageUrl} />
                          <AvatarFallback className="bg-purple-900/50 text-[10px] text-purple-200">
                            {mine ? user?.firstName?.[0] : selectedUser.fullName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`px-4 py-2.5 rounded-2xl max-w-[65%] shadow-sm
                          ${mine
                            ? "bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-br-sm"
                            : "text-white/85 rounded-bl-sm border border-white/7"
                          }`}
                          style={!mine ? { background: "rgba(255,255,255,0.06)" } : {}}>
                          <p className="text-sm leading-relaxed">{msg.content}</p>
                          <span className={`text-[10px] mt-1 block ${mine ? "text-white/50 text-right" : "text-white/25"}`}>{fmt(msg.createdAt)}</span>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={bottomRef} />
                </div>
              </ScrollArea>
              <div className="border-t border-white/5"><MessageInput /></div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-14 h-14 rounded-2xl btn-gradient flex items-center justify-center mb-4 glow">
                <MessageSquare className="size-7 text-white" />
              </div>
              <h3 className="font-semibold text-white/65 mb-1">Your messages</h3>
              <p className="text-sm text-white/28">Select a friend to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ChatPage;
