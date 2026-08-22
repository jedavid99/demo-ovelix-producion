import React, { useState, useEffect, useRef } from 'react';
import { X, Camera, Upload, Loader2, Calendar, Trash2, Image } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { useUpload } from '@/shared/hooks/useUpload';
import { parsePhotoEntry, createPhotoEntry, formatPhotoDate } from '@/shared/lib/photoUtils';
import { repairService } from '@/services/repairService';
import { toast } from '@/shared/components/ui/use-toast';

interface EvidenceModalProps {
  open: boolean;
  onClose: () => void;
  repairId: string;
  onUpdated?: () => void;
}

export function EvidenceModal({ open, onClose, repairId, onUpdated }: EvidenceModalProps) {
  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { upload } = useUpload({ folder: 'repairs/evidence' });

  useEffect(() => {
    if (open && repairId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (repairService.getById(repairId) as Promise<any>)
        .then((response) => {
          const repair = response?.data?.data || response?.data || response;
          setPhotos(repair?.fotos_antes ?? []);
        })
        .catch(() => {
          setPhotos([]);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, repairId]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const newPhotos = [...photos];
      for (const file of Array.from(files)) {
        const result = await upload(file);
        if (result) {
          newPhotos.push(createPhotoEntry(result.url));
        }
      }

      await repairService.update(repairId, { fotos_antes: newPhotos } as Record<string, unknown>);
      setPhotos(newPhotos);
      toast({ title: 'Éxito', description: `${files.length} foto(s) subida(s)` });
      onUpdated?.();
    } catch {
      toast({ title: 'Error', description: 'No se pudieron subir las fotos', variant: 'destructive' });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    try {
      await repairService.update(repairId, { fotos_antes: newPhotos } as Record<string, unknown>);
      setPhotos(newPhotos);
      toast({ title: 'Foto eliminada' });
      onUpdated?.();
    } catch {
      toast({ title: 'Error', description: 'No se pudo eliminar la foto', variant: 'destructive' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
          <DialogTitle className="flex items-center gap-2 text-base">
            <Camera className="w-5 h-5 text-primary" />
            Evidencias de la Reparación
          </DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-7 w-7">
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : photos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
              <Image className="w-12 h-12 mb-3 opacity-40" />
              <p className="text-sm">No hay evidencias subidas</p>
              <p className="text-xs">Subí fotos para documentar el estado del equipo</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {photos.map((entry, idx) => {
                const photo = parsePhotoEntry(entry);
                return (
                  <div key={idx} className="group relative aspect-square rounded-lg overflow-hidden border border-border bg-muted">
                    <img src={photo.url} alt={`Evidencia ${idx + 1}`} loading="lazy" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />
                    {photo.uploadedAt && (
                      <div className="absolute bottom-1.5 left-1.5 right-1.5 bg-black/70 text-white text-[9px] px-2 py-1 rounded flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Calendar className="w-3 h-3 shrink-0" />
                        <span className="truncate">{formatPhotoDate(photo.uploadedAt)}</span>
                      </div>
                    )}
                    <button
                      onClick={() => handleDelete(idx)}
                      className="absolute top-1.5 right-1.5 p-1.5 bg-destructive/90 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive"
                      aria-label="Eliminar foto"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="border-t pt-3 flex justify-end gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
            multiple
            onChange={handleUpload}
            className="hidden"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Upload className="w-4 h-4 mr-2" />
            )}
            {uploading ? 'Subiendo...' : 'Subir fotos'}
          </Button>
          <Button variant="outline" size="sm" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
