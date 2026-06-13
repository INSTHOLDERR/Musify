import { Slider } from "@/components/ui/slider";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { ListMusic, Pause, Play, Repeat, Shuffle, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";
import { useEffect, useState } from "react";
import audio from "@/lib/audioInstance";

const fmt = (s: number) => {
  if (!s || isNaN(s) || !isFinite(s) || s <= 0) return "0:00";
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
};

export const PlaybackControls = () => {
  const { currentSong, isPlaying, togglePlay, playNext, playPrevious, isShuffle, isRepeat, toggleShuffle, toggleRepeat } = usePlayerStore();
  const [volume, setVolume] = useState(75);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showVolume, setShowVolume] = useState(false);

  // When song changes: immediately use DB duration as fallback, reset time
  useEffect(() => {
    setCurrentTime(0);
    // Use the DB duration field right away so it's never blank
    if (currentSong?.duration && currentSong.duration > 0) {
      setDuration(currentSong.duration);
    } else {
      setDuration(0);
    }
  }, [currentSong?._id]);

  // Subscribe to audio events — update duration once audio metadata arrives
  useEffect(() => {
    const onTime = () => setCurrentTime(audio.currentTime);

    const onMeta = () => {
      const d = audio.duration;
      if (isFinite(d) && !isNaN(d) && d > 0) {
        setDuration(d); // real duration from stream, overrides DB value
      }
    };

    const onEnd = () => {
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        playNext();
      }
    };

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("durationchange", onMeta);
    audio.addEventListener("canplaythrough", onMeta);
    audio.addEventListener("ended", onEnd);

    // Grab immediately if already loaded
    if (isFinite(audio.duration) && audio.duration > 0) {
      setDuration(audio.duration);
      setCurrentTime(audio.currentTime);
    }

    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("durationchange", onMeta);
      audio.removeEventListener("canplaythrough", onMeta);
      audio.removeEventListener("ended", onEnd);
    };
  }, [currentSong?._id, isRepeat, playNext]);

  // Set initial volume
  useEffect(() => { audio.volume = volume / 100; }, []);

  const handleVolumeChange = (v: number) => {
    setVolume(v);
    setMuted(v === 0);
    audio.volume = v / 100;
  };

  const toggleMute = () => {
    const newMuted = !muted;
    setMuted(newMuted);
    audio.volume = newMuted ? 0 : volume / 100;
  };

  const seek = (v: number) => { audio.currentTime = v; };

  return (
    <footer className="glass-dark border-t border-white/5 px-3 sm:px-4 h-[64px] sm:h-[72px] shrink-0 relative z-20">
      <div className="h-full max-w-[1600px] mx-auto flex items-center justify-between gap-2 sm:gap-4">

        {/* Now playing */}
        <div className="flex items-center gap-2 sm:gap-3 w-[32%] sm:w-[28%] min-w-0">
          {currentSong ? (
            <>
              <div className={`relative shrink-0 ${isPlaying ? "glow-sm" : ""} transition-all`}>
                <img src={currentSong.imageUrl} alt={currentSong.title}
                  className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl object-cover ring-1 ${isPlaying ? "ring-purple-500/40" : "ring-white/10"} transition-all`} />
              </div>
              <div className="min-w-0 hidden sm:block">
                <p className="font-semibold text-sm text-white/90 truncate">{currentSong.title}</p>
                <p className="text-xs text-white/35 truncate">{currentSong.artist}</p>
              </div>
            </>
          ) : (
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl ring-1 ring-white/6 flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.03)" }}>
              <ListMusic className="size-4 text-white/15" />
            </div>
          )}
        </div>

        {/* Center controls */}
        <div className="flex flex-col items-center gap-1.5 flex-1 max-w-[520px]">
          <div className="flex items-center gap-2 sm:gap-4">
            <button onClick={toggleShuffle} title="Shuffle"
              className={`transition-colors hidden sm:block ${isShuffle ? "text-purple-400" : "text-white/20 hover:text-purple-300"}`}>
              <Shuffle className="size-3.5" />
            </button>
            <button onClick={playPrevious} disabled={!currentSong}
              className="text-white/45 hover:text-white transition-colors disabled:opacity-25">
              <SkipBack className="size-4 fill-current" />
            </button>
            <button onClick={togglePlay} disabled={!currentSong}
              className="btn-gradient rounded-full w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center glow-sm shrink-0 disabled:opacity-30">
              {isPlaying
                ? <Pause className="size-4 fill-white text-white" />
                : <Play className="size-4 fill-white text-white ml-0.5" />}
            </button>
            <button onClick={playNext} disabled={!currentSong}
              className="text-white/45 hover:text-white transition-colors disabled:opacity-25">
              <SkipForward className="size-4 fill-current" />
            </button>
            <button onClick={toggleRepeat} title="Repeat"
              className={`transition-colors hidden sm:block ${isRepeat ? "text-purple-400" : "text-white/20 hover:text-purple-300"}`}>
              <Repeat className="size-3.5" />
            </button>
          </div>

          {/* Progress bar */}
          <div className="flex items-center gap-1.5 sm:gap-2 w-full">
            <span className="text-[9px] sm:text-[10px] text-white/25 w-7 text-right tabular-nums">{fmt(currentTime)}</span>
            <Slider
              value={[currentTime]}
              max={duration > 0 ? duration : 100}
              step={0.5}
              className="flex-1"
              onValueChange={([v]) => seek(v)}
            />
            <span className="text-[9px] sm:text-[10px] text-white/25 w-7 tabular-nums">{fmt(duration)}</span>
          </div>
        </div>

        {/* Desktop volume */}
        <div className="hidden sm:flex items-center gap-2 justify-end w-[28%]">
          <button onClick={toggleMute} className="text-white/25 hover:text-white/55 transition-colors">
            {muted || volume === 0
              ? <VolumeX className="size-3.5 shrink-0" />
              : <Volume2 className="size-3.5 shrink-0" />}
          </button>
          <Slider value={[muted ? 0 : volume]} max={100} step={1} className="w-24"
            onValueChange={([v]) => handleVolumeChange(v)} />
        </div>

        {/* Mobile volume popup */}
        <div className="flex sm:hidden items-center justify-end w-[32%] relative">
          <button onClick={() => setShowVolume(v => !v)}
            className="text-white/30 hover:text-white/60 p-2 transition-colors">
            {muted || volume === 0 ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
          </button>
          {showVolume && (
            <div className="absolute bottom-12 right-0 glass-dark rounded-2xl border border-white/10 p-4 shadow-2xl z-50 w-36">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-white/45">Volume</span>
                <span className="text-xs text-white/35 tabular-nums">{muted ? 0 : volume}%</span>
              </div>
              <Slider value={[muted ? 0 : volume]} max={100} step={1}
                onValueChange={([v]) => handleVolumeChange(v)} />
              <button onClick={toggleMute}
                className="mt-3 w-full text-center text-xs text-white/30 hover:text-white/55 transition-colors">
                {muted ? "Unmute" : "Mute"}
              </button>
            </div>
          )}
        </div>

      </div>
    </footer>
  );
};
