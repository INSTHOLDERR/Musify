import { usePlayerStore } from "@/stores/usePlayerStore";
import { Song } from "@/types";
import { Pause, Play } from "lucide-react";

const PlayButton = ({ song }: { song: Song }) => {
  const { currentSong, isPlaying, setCurrentSong, togglePlay } = usePlayerStore();
  const isCurrent = currentSong?._id === song._id;
  return (
    <button
      onClick={(e) => { e.stopPropagation(); e.preventDefault(); isCurrent ? togglePlay() : setCurrentSong(song); }}
      className={`btn-gradient rounded-full w-9 h-9 flex items-center justify-center glow-sm shrink-0 transition-all
        ${isCurrent ? "opacity-100 scale-100" : "opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100"}`}>
      {isCurrent && isPlaying
        ? <Pause className="size-3.5 fill-white text-white" />
        : <Play className="size-3.5 fill-white text-white ml-0.5" />}
    </button>
  );
};
export default PlayButton;
