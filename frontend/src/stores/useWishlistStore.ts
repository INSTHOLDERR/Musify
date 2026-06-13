import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Song } from "@/types";

export interface Wishlist {
  id: string;
  name: string;
  songIds: string[];
  createdAt: string;
}

interface WishlistStore {
  wishlists: Wishlist[];
  createWishlist: (name: string) => void;
  deleteWishlist: (id: string) => void;
  addToWishlist: (wishlistId: string, songId: string) => void;
  removeFromWishlist: (wishlistId: string, songId: string) => void;
  toggleLike: (song: Song) => void;
  // isLiked: true if song is in the "Liked Songs" wishlist specifically
  isLiked: (songId: string) => boolean;
  // isInAnyWishlist: true if song is in ANY wishlist (for filled heart)
  isInAnyWishlist: (songId: string) => boolean;
  getLikedWishlist: () => Wishlist | undefined;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      wishlists: [
        { id: "liked", name: "Liked Songs", songIds: [], createdAt: new Date().toISOString() }
      ],

      createWishlist: (name: string) => {
        const newList: Wishlist = {
          id: Date.now().toString(),
          name,
          songIds: [],
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ wishlists: [...s.wishlists, newList] }));
      },

      deleteWishlist: (id: string) => {
        if (id === "liked") return;
        set((s) => ({ wishlists: s.wishlists.filter((w) => w.id !== id) }));
      },

      addToWishlist: (wishlistId: string, songId: string) => {
        set((s) => ({
          wishlists: s.wishlists.map((w) =>
            w.id === wishlistId && !w.songIds.includes(songId)
              ? { ...w, songIds: [...w.songIds, songId] }
              : w
          ),
        }));
      },

      removeFromWishlist: (wishlistId: string, songId: string) => {
        set((s) => ({
          wishlists: s.wishlists.map((w) =>
            w.id === wishlistId
              ? { ...w, songIds: w.songIds.filter((id) => id !== songId) }
              : w
          ),
        }));
      },

      toggleLike: (song: Song) => {
        const liked = get().wishlists.find((w) => w.id === "liked");
        if (!liked) return;
        if (liked.songIds.includes(song._id)) {
          get().removeFromWishlist("liked", song._id);
        } else {
          get().addToWishlist("liked", song._id);
        }
      },

      // In "Liked Songs" specifically
      isLiked: (songId: string) => {
        const liked = get().wishlists.find((w) => w.id === "liked");
        return liked?.songIds.includes(songId) ?? false;
      },

      // In ANY wishlist — use this for the filled heart icon
      isInAnyWishlist: (songId: string) => {
        return get().wishlists.some((w) => w.songIds.includes(songId));
      },

      getLikedWishlist: () => get().wishlists.find((w) => w.id === "liked"),
    }),
    { name: "musiffy-wishlists" }
  )
);
