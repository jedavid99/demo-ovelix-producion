import React from 'react';
import { Camera, X } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { toast } from '@/shared/components/ui/use-toast';
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
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    try {
      const mockUrl = URL.createObjectURL(file);
      setFormData({ ...formData, foto_evidencia: mockUrl });
    } catch (error) {
      toast({ title: 'Error', description: 'Error al guardar. Intentalo de nuevo.', variant: 'destructive' });
      if (process.env.NODE_ENV === 'development') console.error('Error al subir foto:', error);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleRemovePhoto = () => {
    setFormData({ ...formData, foto_evidencia: '' });
  };

  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">Foto de Evidencia</label>
      {formData.foto_evidencia ? (
        <div className="relative inline-block">
          <img
            src={formData.foto_evidencia}
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
        </div>
      ) : (
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:bg-muted/30 transition-colors">
          <Camera className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground mb-4">
            Arrastra una imagen o haz clic para subir
          </p>
          <Input
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            disabled={uploadingPhoto}
            className="max-w-xs mx-auto"
          />
          {uploadingPhoto && (
            <p className="text-xs text-muted-foreground mt-2">Subiendo...</p>
          )}
        </div>
      )}
    </div>
  );
};
