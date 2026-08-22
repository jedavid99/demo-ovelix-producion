import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  images: string[];
  open: boolean;
  initialIndex?: number;
  onClose: () => void;
}

export function StockImageCarousel({ images, open, initialIndex = 0, onClose }: Props) {
  const [current, setCurrent] = useState(initialIndex);

  const prev = () => setCurrent(i => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setCurrent(i => (i === images.length - 1 ? 0 : i + 1));

  if (!open || images.length === 0) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative max-w-3xl w-full mx-4"
            onClick={e => e.stopPropagation()}
          >
            <Button
              variant="ghost"
              size="icon-sm"
              className="absolute -top-10 right-0 text-white hover:text-white/80"
              onClick={onClose}
            >
              <X size={20} />
            </Button>

            <div className="relative bg-card rounded-xl overflow-hidden border border-border shadow-2xl">
              <div className="aspect-video flex items-center justify-center bg-black/5">
                <img
                  src={images[current]}
                  alt={`Foto ${current + 1}`}
                  className="max-h-[70vh] max-w-full object-contain"
                />
              </div>

              {images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white hover:bg-black/60 hover:text-white rounded-full"
                    onClick={prev}
                  >
                    <ChevronLeft size={20} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white hover:bg-black/60 hover:text-white rounded-full"
                    onClick={next}
                  >
                    <ChevronRight size={20} />
                  </Button>
                </>
              )}

              {images.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/50 rounded-full px-3 py-1.5">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrent(i)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        i === current ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/60'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            <p className="text-center text-white/60 text-xs mt-3">
              {current + 1} / {images.length}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function StockImageThumbnail({
  item,
  onClick,
}: {
  item: { imagen_url?: string; nombre: string };
  onClick?: () => void;
}) {
  if (!item.imagen_url) {
    return (
      <div className="h-10 w-10 rounded-lg bg-muted/50 flex items-center justify-center text-muted-foreground text-xs font-bold shrink-0">
        {item.nombre.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="h-10 w-10 rounded-lg overflow-hidden border border-border shrink-0 hover:ring-2 hover:ring-primary/30 transition-all cursor-pointer"
    >
      <img src={item.imagen_url} alt={item.nombre} className="h-full w-full object-cover" />
    </button>
  );
}
