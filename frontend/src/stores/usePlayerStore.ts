import { create } from "zustand";
import { Song } from "@/types";
import { useChatStore } from "./useChatStore";

interface PlayerStore {
  currentSong: Song | null;
  isPlaying: boolean;
  queue: Song[];
  currentIndex: number;
  isShuffle: boolean;
  isRepeat: boolean;

  initializeQueue: (songs: Song[]) => void;
  playAlbum: (songs: Song[], startIndex?: number) => void;
  setCurrentSong: (song: Song | null) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrevious: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
}

const emitActivity = (activity: string) => {
  try {
    const socket = useChatStore.getState().socket;
    if (socket?.auth) socket.emit("update_activity", { userId: socket.auth.userId, activity });
  } catch {}
};

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  currentSong: null,
  isPlaying: false,
  queue: [],
  currentIndex: -1,
  isShuffle: false,
  isRepeat: false,

  toggleShuffle: () => set((s) => ({ isShuffle: !s.isShuffle })),
  toggleRepeat: () => set((s) => ({ isRepeat: !s.isRepeat })),

  initializeQueue: (songs: Song[]) => {
    set({
      queue: songs,
      currentSong: get().currentSong || songs[0],
      currentIndex: get().currentIndex === -1 ? 0 : get().currentIndex,
    });
  },

  playAlbum: (songs: Song[], startIndex = 0) => {
    if (songs.length === 0) return;
    const song = songs[startIndex];
    emitActivity(`Playing ${song.title} by ${song.artist}`);
    set({ queue: songs, currentSong: song, currentIndex: startIndex, isPlaying: true });
  },

  setCurrentSong: (song: Song | null) => {
    if (!song) return;
    emitActivity(`Playing ${song.title} by ${song.artist}`);
    const songIndex = get().queue.findIndex((s) => s._id === song._id);
    set({
      currentSong: song,
      isPlaying: true,
      currentIndex: songIndex !== -1 ? songIndex : get().currentIndex,
    });
  },

  togglePlay: () => {
    const willPlay = !get().isPlaying;
    const currentSong = get().currentSong;
    emitActivity(willPlay && currentSong ? `Playing ${currentSong.title} by ${currentSong.artist}` : "Idle");
    set({ isPlaying: willPlay });
  },

  playNext: () => {
    const { currentIndex, queue, isShuffle } = get();
    let nextIndex: number;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else {
      nextIndex = currentIndex + 1;
    }
    if (nextIndex < queue.length) {
      const next = queue[nextIndex];
      emitActivity(`Playing ${next.title} by ${next.artist}`);
      set({ currentSong: next, currentIndex: nextIndex, isPlaying: true });
    } else {
      set({ isPlaying: false });
      emitActivity("Idle");
    }
  },

  playPrevious: () => {
    const { currentIndex, queue } = get();
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      const prev = queue[prevIndex];
      emitActivity(`Playing ${prev.title} by ${prev.artist}`);
      set({ currentSong: prev, currentIndex: prevIndex, isPlaying: true });
    } else {
      // restart current
      set({ isPlaying: true });
    }
  },
}));
