import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { axiosInstance } from "@/lib/axios";
import { useMusicStore } from "@/stores/useMusicStore";
import { CheckCircle2, ImageIcon, Plus, Upload } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

const AddAlbumDialog = () => {
  const { fetchAlbums } = useMusicStore();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [album, setAlbum] = useState({ title: "", artist: "", releaseYear: String(new Date().getFullYear()) });
  const [image, setImage] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const reset = () => { setAlbum({ title: "", artist: "", releaseYear: String(new Date().getFullYear()) }); setImage(null); };
  const canSubmit = album.title && album.artist && album.releaseYear && image && !loading;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("title", album.title); fd.append("artist", album.artist);
      fd.append("releaseYear", album.releaseYear); fd.append("imageFile", image!);
      await axiosInstance.post("/admin/albums", fd, { headers: { "Content-Type": "multipart/form-data" } });
      await fetchAlbums();
      toast.success("Album created!");
      reset(); setOpen(false);
    } catch (e: any) { toast.error(e.response?.data?.message ?? e.message); }
    finally { setLoading(false); }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
      <DialogTrigger asChild>
        <button className="px-4 py-2.5 rounded-xl text-sm font-semibold inline-flex items-center gap-2 border border-white/12 text-white/45 hover:text-white/72 hover:border-white/22 transition-colors">
          <Plus className="size-4" />Add Album
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md" style={{ background: "#0e0e1c", border: "1px solid rgba(236,72,153,0.2)" }}>
        <DialogHeader>
          <DialogTitle className="text-white/88">Add New Album</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-1">
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={e => setImage(e.target.files![0])} />

          <div>
            <label className="text-xs text-white/38 mb-1.5 block">Artwork <span className="text-red-400/65">*</span></label>
            <div onClick={() => fileRef.current?.click()}
              className="relative h-44 rounded-xl border-2 border-dashed cursor-pointer transition-all overflow-hidden group"
              style={{ borderColor: image ? "rgba(236,72,153,0.45)" : "rgba(255,255,255,0.1)" }}>
              {image && <img src={URL.createObjectURL(image)} className="absolute inset-0 w-full h-full object-cover opacity-55" />}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 z-10 group-hover:bg-black/10 transition-colors">
                {image
                  ? <><CheckCircle2 className="size-6 text-pink-400" /><span className="text-xs text-pink-300 font-medium">{image.name.slice(0, 28)}</span></>
                  : <><ImageIcon className="size-7 text-white/18" /><span className="text-sm text-white/28">Upload album artwork</span><span className="text-xs text-white/15">Click to browse</span></>}
              </div>
            </div>
          </div>

          {[["Album Title", "title"], ["Artist Name", "artist"]].map(([placeholder, key]) => (
            <div key={key}>
              <label className="text-xs text-white/38 mb-1.5 block">{placeholder} <span className="text-red-400/65">*</span></label>
              <Input value={(album as any)[key]} onChange={e => setAlbum({ ...album, [key]: e.target.value })}
                placeholder={`Enter ${placeholder.toLowerCase()}`}
                className="bg-white/5 border-white/10 text-white/82 placeholder:text-white/18 rounded-xl focus:border-purple-500/40" />
            </div>
          ))}

          <div>
            <label className="text-xs text-white/38 mb-1.5 block">Release Year <span className="text-red-400/65">*</span></label>
            <Input type="number" min={1900} max={new Date().getFullYear()} value={album.releaseYear}
              onChange={e => setAlbum({ ...album, releaseYear: e.target.value })}
              className="bg-white/5 border-white/10 text-white/82 rounded-xl focus:border-purple-500/40" />
          </div>

          <div className="flex gap-2 pt-2">
            <button onClick={() => { setOpen(false); reset(); }} disabled={loading}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-white/10 text-white/38 hover:text-white/55 transition-colors disabled:opacity-28">
              Cancel
            </button>
            <button onClick={handleSubmit} disabled={!canSubmit}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold btn-gradient glow-sm flex items-center justify-center gap-2">
              {loading ? <><div className="spinner" />Creating…</> : <><Upload className="size-3.5" />Create Album</>}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default AddAlbumDialog;
