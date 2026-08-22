import { useState } from 'react';
import { FileText, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { parsePhotoEntry, formatPhotoDate } from '@/shared/lib/photoUtils';

export function PhotoCard({ photos }: { photos: string[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (photos.length === 0) return null;

  const parsed = photos.map(parsePhotoEntry);
  const current = parsed[activeIndex];

  const goPrev = () => setActiveIndex((i) => (i > 0 ? i - 1 : parsed.length - 1));
  const goNext = () => setActiveIndex((i) => (i < parsed.length - 1 ? i + 1 : 0));

  return (
    <div className="px-6 py-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
          Evidencia {parsed.length > 1 ? `(${parsed.length})` : ''}
        </span>
        {parsed.length > 1 && (
          <div className="flex items-center gap-1">
            <button
              onClick={goPrev}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Foto anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-[10px] text-muted-foreground tabular-nums min-w-[2rem] text-center">
              {activeIndex + 1}/{parsed.length}
            </span>
            <button
              onClick={goNext}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Foto siguiente"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Main image */}
      <div className="relative rounded-lg overflow-hidden border border-border/60 bg-muted">
        <img
          src={current.url}
          alt={`Evidencia ${activeIndex + 1}`}
          loading="lazy"
          className="w-full h-56 object-contain"
        />
        {current.uploadedAt && (
          <div className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] px-2 py-1 rounded flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatPhotoDate(current.uploadedAt)}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {parsed.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {parsed.map((photo, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`relative shrink-0 w-14 h-14 rounded-md overflow-hidden border-2 transition-all ${
                idx === activeIndex
                  ? 'border-primary ring-1 ring-primary/30'
                  : 'border-border/60 opacity-60 hover:opacity-100'
              }`}
              aria-label={`Ver evidencia ${idx + 1}`}
            >
              <img
                src={photo.url}
                alt={`Miniatura ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function NotesCard({ notas }: { notas: string }) {
  return (
    <div className="px-6 py-4">
      <div className="flex items-center gap-2 mb-2">
        <FileText className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Notas</span>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed italic pl-5.5">
        {notas}
      </p>
    </div>
  );
}
