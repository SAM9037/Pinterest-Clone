import type { Pin } from "@/lib/pinterest-api";
import { Trash2 } from "lucide-react";

export function PinCard({ pin, onDelete }: { pin: Pin; onDelete?: (id: number) => void }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-card shadow-sm hover:shadow-xl transition-all">
      <img
        src={pin.mediaUrl}
        alt={pin.title}
        loading="lazy"
        className="w-full h-auto block"
        onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600"; }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
        <h3 className="text-white font-semibold leading-tight">{pin.title}</h3>
        {pin.description && <p className="text-white/80 text-xs mt-1 line-clamp-2">{pin.description}</p>}
      </div>
      {onDelete && pin.pinId && (
        <button
          onClick={() => onDelete(pin.pinId!)}
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 hover:bg-white text-foreground p-2 rounded-full shadow"
          title="Delete pin"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
