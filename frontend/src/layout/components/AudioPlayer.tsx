import { usePlayerStore } from "@/stores/usePlayerStore";
import audio from "@/lib/audioInstance";
import { useEffect, useRef } from "react";

const AudioPlayer = () => {
  const prevUrlRef = useRef<string | null>(null);
  const { currentSong, isPlaying, playNext, isRepeat } = usePlayerStore();

  // Play / pause
  useEffect(() => {
    if (isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // Handle song change
  useEffect(() => {
    if (!currentSong) return;
    if (prevUrlRef.current === currentSong.audioUrl) return;
    prevUrlRef.current = currentSong.audioUrl;
    audio.src = currentSong.audioUrl;
    audio.load();
    if (isPlaying) audio.play().catch(() => {});
  }, [currentSong]);

  // Handle ended
  useEffect(() => {
    const onEnd = () => {
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        playNext();
      }
    };
    audio.addEventListener("ended", onEnd);
    return () => audio.removeEventListener("ended", onEnd);
  }, [isRepeat, playNext]);

  return null; // no <audio> element needed — we use the singleton
};
export default AudioPlayer;
