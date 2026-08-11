import { Camera, Upload, X, Info } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';

interface MultimediaSectionProps {
  uploadedPhotos: string[];
  onPhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemovePhoto: (index: number, e: React.MouseEvent) => void;
}

export const MultimediaSection = ({ uploadedPhotos, onPhotoUpload, onRemovePhoto }: MultimediaSectionProps) => (
  <Card>
    <CardContent className="p-5 space-y-4">
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <Camera size={18} className="text-primary" />
        <h2 className="text-sm font-bold text-foreground">5. Multimedia</h2>
      </div>
      <div>
        <label htmlFor="photo-upload"
          className="block border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/20 transition-all">
          <Upload size={28} className="mx-auto text-muted-foreground/60 mb-1" />
          <p className="text-xs font-medium text-muted-foreground">Suelta imágenes aquí</p>
          <p className="text-[10px] text-muted-foreground">PNG, JPG hasta 10MB</p>
          <input id="photo-upload" type="file" accept="image/*" multiple onChange={onPhotoUpload} className="hidden" />
        </label>
        {uploadedPhotos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3">
            {uploadedPhotos.map((photo, idx) => (
              <div key={idx} className="aspect-square rounded-lg bg-muted border border-border overflow-hidden relative group">
                <img src={photo} alt={`Foto ${idx + 1}`} loading="lazy" className="w-full h-full object-cover" />
                <button onClick={(e) => onRemovePhoto(idx, e)}
                  className="absolute top-1 right-1 p-0.5 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <X size={12} className="text-white" />
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="flex items-start gap-2 mt-3 p-2 bg-primary/5 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-900/40">
          <Info size={14} className="text-primary flex-shrink-0 mt-0.5" />
          <p className="text-[10px] text-primary dark:text-blue-300">Asegura que IMEI y Serie sean visibles en al menos una foto.</p>
        </div>
      </div>
    </CardContent>
  </Card>
);
