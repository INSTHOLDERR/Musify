import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { axiosInstance } from "@/lib/axios";
import { useMusicStore } from "@/stores/useMusicStore";
import { CheckCircle2, ImageIcon, Music2, Plus, Upload } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

const AddSongDialog = () => {
  const { albums, fetchSongs } = useMusicStore();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [song, setSong] = useState({ title: "", artist: "", album: "", duration: "" });
  const [files, setFiles] = useState<{ audio: File | null; image: File | null }>({ audio: null, image: null });
  const audioRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);

  const reset = () => { setSong({ title: "", artist: "", album: "", duration: "" }); setFiles({ audio: null, image: null }); };
  const canSubmit = song.title && song.artist && song.duration && files.audio && files.image && !loading;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("title", song.title); fd.append("artist", song.artist);
      fd.append("duration", song.duration);
      if (song.album && song.album !== "none") fd.append("albumId", song.album);
      fd.append("audioFile", files.audio!); fd.append("imageFile", files.image!);
      await axiosInstance.post("/admin/songs", fd, { headers: { "Content-Type": "multipart/form-data" } });
      await fetchSongs();
      toast.success("Song added successfully!");
      reset(); setOpen(false);
    } catch (e: any) { toast.error(e.response?.data?.message ?? e.message); }
    finally { setLoading(false); }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
      <DialogTrigger asChild>
        <button className="btn-gradient px-4 py-2.5 rounded-xl text-sm font-semibold inline-flex items-center gap-2 glow-sm">
          <Plus className="size-4" />Add Song
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg"
        style={{ background: "#0e0e1c", border: "1px solid rgba(147,51,234,0.2)" }}>
        <DialogHeader>
          <DialogTitle className="text-white/88">Add New Song</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-1">
          <input ref={audioRef} type="file" accept="audio/*" hidden onChange={e => setFiles(p => ({ ...p, audio: e.target.files![0] }))} />
          <input ref={imageRef} type="file" accept="image/*" hidden onChange={e => setFiles(p => ({ ...p, image: e.target.files![0] }))} />

          {/* Artwork upload */}
          <div>
            <label className="text-xs text-white/38 mb-1.5 block">Artwork <span className="text-red-400/65">*</span></label>
            <div onClick={() => imageRef.current?.click()}
              className="relative h-36 rounded-xl border-2 border-dashed cursor-pointer transition-all overflow-hidden group"
              style={{ borderColor: files.image ? "rgba(147,51,234,0.45)" : "rgba(255,255,255,0.1)" }}>
              {files.image && <img src={URL.createObjectURL(files.image)} className="absolute inset-0 w-full h-full object-cover opacity-45" />}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 z-10 group-hover:bg-black/10 transition-colors">
                {files.image
                  ? <><CheckCircle2 className="size-5 text-purple-400" /><span className="text-xs text-purple-300 font-medium">{files.image.name.slice(0, 30)}</span></>
                  : <><ImageIcon className="size-5 text-white/22" /><span className="text-xs text-white/28">Click to upload artwork</span></>}
              </div>
            </div>
          </div>

          {/* Audio upload */}
          <div>
            <label className="text-xs text-white/38 mb-1.5 block">Audio File <span className="text-red-400/65">*</span></label>
            <button onClick={() => audioRef.current?.click()}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm border transition-all text-left
                ${files.audio ? "border-purple-500/35 bg-purple-500/8 text-purple-300" : "border-white/10 bg-white/3 text-white/38 hover:border-white/18 hover:text-white/55"}`}>
              <Music2 className="size-4 shrink-0" />
              <span className="truncate">{files.audio ? files.audio.name : "Choose audio file (mp3, wav…)"}</span>
              {files.audio && <CheckCircle2 className="size-4 text-purple-400 shrink-0 ml-auto" />}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[["Title", "title"], ["Artist", "artist"]].map(([label, key]) => (
              <div key={key}>
                <label className="text-xs text-white/38 mb-1.5 block">{label} <span className="text-red-400/65">*</span></label>
                <Input value={(song as any)[key]} onChange={e => setSong({ ...song, [key]: e.target.value })}
                  placeholder={`Enter ${label.toLowerCase()}`}
                  className="bg-white/5 border-white/10 text-white/82 placeholder:text-white/18 rounded-xl focus:border-purple-500/40" />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-white/38 mb-1.5 block">Duration (sec) <span className="text-red-400/65">*</span></label>
              <Input type="number" min="0" value={song.duration} onChange={e => setSong({ ...song, duration: e.target.value })}
                placeholder="e.g. 210"
                className="bg-white/5 border-white/10 text-white/82 placeholder:text-white/18 rounded-xl focus:border-purple-500/40" />
            </div>
            <div>
              <label className="text-xs text-white/38 mb-1.5 block">Album <span className="text-white/15">(optional)</span></label>
              <Select value={song.album} onValueChange={v => setSong({ ...song, album: v })}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white/55 rounded-xl">
                  <SelectValue placeholder="None (Single)" />
                </SelectTrigger>
                <SelectContent style={{ background: "#0e0e1c", border: "1px solid rgba(147,51,234,0.2)" }}>
                  <SelectItem value="none" className="text-white/45">None (Single)</SelectItem>
                  {albums.map(a => <SelectItem key={a._id} value={a._id} className="text-white/72">{a.title}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button onClick={() => { setOpen(false); reset(); }} disabled={loading}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-white/10 text-white/38 hover:text-white/55 hover:border-white/18 transition-colors disabled:opacity-28">
              Cancel
            </button>
            <button onClick={handleSubmit} disabled={!canSubmit}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold btn-gradient glow-sm flex items-center justify-center gap-2">
              {loading ? <><div className="spinner" />Uploading…</> : <><Upload className="size-3.5" />Add Song</>}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default AddSongDialog;
