import React from 'react';
import { Camera, X, Loader2, Calendar } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { useUpload } from '@/shared/hooks/useUpload';
import { createPhotoEntry, parsePhotoEntry, formatPhotoDate } from '@/shared/lib/photoUtils';
import type { FormData } from './RepairEdit.types';

interface EditPhotoEvidenceProps {
  formData: FormData;
  setFormData: (data: FormData | ((prev: FormData) => FormData)) => void;
  uploadingPhoto: boolean;
  setUploadingPhoto: (value: boolean) => void;
}

export const EditPhotoEvidence: React.FC<EditPhotoEvidenceProps> = ({
  formData,
  setFormData,
  uploadingPhoto,
  setUploadingPhoto,
}) => {
  const { upload } = useUpload({ folder: 'repairs/evidence' });

  const firstPhoto = formData.fotos_antes.length > 0 ? parsePhotoEntry(formData.fotos_antes[0]) : null;

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    const result = await upload(file);
    if (result) {
      const newEntry = createPhotoEntry(result.url);
      setFormData((prev) => ({ ...prev, fotos_antes: [newEntry, ...prev.fotos_antes] }));
    }
    setUploadingPhoto(false);
  };

  const handleRemovePhoto = () => {
    setFormData((prev) => ({ ...prev, fotos_antes: prev.fotos_antes.slice(1) }));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">Foto de Evidencia</label>
      {firstPhoto ? (
        <div className="relative inline-block">
          <img
            src={firstPhoto.url}
            alt="Evidencia"
            loading="lazy"
            className="w-full max-w-sm h-48 object-cover rounded-lg border"
          />
          <Button
            variant="destructive"
            size="icon"
            onClick={handleRemovePhoto}
            className="absolute top-2 right-2"
            aria-label="Eliminar foto"
          >
            <X className="h-4 w-4" />
          </Button>
          {firstPhoto.uploadedAt && (
            <div className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] px-2 py-1 rounded-md flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatPhotoDate(firstPhoto.uploadedAt)}
            </div>
          )}
        </div>
      ) : (
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:bg-muted/30 transition-colors">
          {uploadingPhoto ? (
            <Loader2 className="h-8 w-8 text-muted-foreground mx-auto mb-2 animate-spin" />
          ) : (
            <Camera className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          )}
          <p className="text-sm text-muted-foreground mb-4">
            {uploadingPhoto ? 'Subiendo imagen...' : 'Arrastra una imagen o haz clic para subir'}
          </p>
          <Input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
            onChange={handlePhotoUpload}
            disabled={uploadingPhoto}
            className="max-w-xs mx-auto"
          />
        </div>
      )}
    </div>
  );
};
