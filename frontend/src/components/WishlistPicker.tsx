import { useWishlistStore } from "@/stores/useWishlistStore";
import { Song } from "@/types";
import { Heart, ListMusic, Plus, X } from "lucide-react";
import { useState } from "react";

interface Props {
  song: Song;
  onClose: () => void;
}

const WishlistPicker = ({ song, onClose }: Props) => {
  const { wishlists, addToWishlist, removeFromWishlist, createWishlist } = useWishlistStore();
  const [newName, setNewName] = useState("");
  const [showInput, setShowInput] = useState(false);

  const isInWishlist = (wid: string) =>
    wishlists.find(w => w.id === wid)?.songIds.includes(song._id) ?? false;

  const toggle = (wid: string) => {
    if (isInWishlist(wid)) {
      removeFromWishlist(wid, song._id);
    } else {
      addToWishlist(wid, song._id);
    }
    // Close immediately after selecting / deselecting
    onClose();
  };

  const handleCreate = () => {
    if (!newName.trim()) return;
    createWishlist(newName.trim());
    setTimeout(() => {
      const newList = useWishlistStore.getState().wishlists.find(
        w => w.name === newName.trim() && w.id !== "liked"
      );
      if (newList) addToWishlist(newList.id, song._id);
    }, 10);
    setNewName("");
    setShowInput(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        className="glass rounded-2xl w-full max-w-xs border border-white/10 shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/6">
          <div className="flex items-center gap-2.5 min-w-0">
            <img src={song.imageUrl} className="size-8 rounded-lg object-cover shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white/90 truncate">{song.title}</p>
              <p className="text-xs text-white/35 truncate">{song.artist}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white/65 ml-2 shrink-0">
            <X className="size-4" />
          </button>
        </div>

        {/* Wishlists — tap any to add & close */}
        <div className="py-2 max-h-60 overflow-y-auto">
          <p className="text-[10px] uppercase tracking-widest text-white/20 font-semibold px-5 pb-1">
            Add to wishlist
          </p>
          {wishlists.map(w => {
            const inList = isInWishlist(w.id);
            return (
              <button
                key={w.id}
                onClick={() => toggle(w.id)}
                className={`w-full flex items-center gap-3 px-5 py-3 hover:bg-white/5 transition-colors text-left
                  ${inList ? "bg-purple-500/5" : ""}`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                  inList
                    ? w.id === "liked"
                      ? "bg-pink-500/25 border border-pink-500/35"
                      : "bg-purple-500/25 border border-purple-500/35"
                    : "bg-white/6 border border-white/8"
                }`}>
                  {w.id === "liked"
                    ? <Heart className={`size-3.5 ${inList ? "fill-pink-400 text-pink-400" : "text-white/35"}`} />
                    : <ListMusic className={`size-3.5 ${inList ? "text-purple-300" : "text-white/35"}`} />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm truncate ${inList ? "text-white/90 font-medium" : "text-white/55"}`}>
                    {w.name}
                  </p>
                  <p className="text-[10px] text-white/22">{w.songIds.length} songs</p>
                </div>
                {inList && (
                  <span className="text-[10px] text-pink-400 font-medium shrink-0">Added ✓</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Create new wishlist */}
        <div className="border-t border-white/6 px-5 py-3">
          {showInput ? (
            <div className="flex items-center gap-2">
              <input
                value={newName}
                onChange={e => setNewName(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleCreate()}
                autoFocus
                placeholder="Wishlist name..."
                className="flex-1 bg-white/6 rounded-lg px-3 py-2 text-sm text-white/80 placeholder:text-white/25 outline-none border border-white/8 focus:border-purple-500/35"
              />
              <button
                onClick={handleCreate}
                disabled={!newName.trim()}
                className="btn-gradient rounded-lg px-3 py-2 text-xs font-semibold disabled:opacity-40"
              >
                Add
              </button>
              <button
                onClick={() => { setShowInput(false); setNewName(""); }}
                className="text-white/25 hover:text-white/55 p-2"
              >
                <X className="size-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowInput(true)}
              className="w-full flex items-center gap-2.5 text-sm text-white/40 hover:text-purple-300 transition-colors py-1"
            >
              <Plus className="size-4" />New wishlist
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export default WishlistPicker;
