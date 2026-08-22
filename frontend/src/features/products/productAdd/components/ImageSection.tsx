import { useState, useRef } from 'react';
import { Upload, X, ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Label } from '@/shared/components/ui/label';
import { FormSection } from './FormSection';
import { useUpload } from '@/shared/hooks/useUpload';
import type { ProductFormData } from '../types';

interface Props {
  form: ProductFormData;
  onChange: (field: keyof ProductFormData, value: string) => void;
}

export function ImageSection({ form, onChange }: Props) {
  const { uploading, upload, remove } = useUpload({ folder: 'stock' });
  const [preview, setPreview] = useState<string | null>(form.imagen_url || null);
  const fileRef = useRef<HTMLInputElement>(null);
  const currentKeyRef = useRef<string | null>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const result = await upload(file);
    if (result) {
      if (currentKeyRef.current) {
        await remove(currentKeyRef.current);
      }
      currentKeyRef.current = result.key;
      setPreview(result.url);
      onChange('imagen_url', result.url);
    }
  };

  const handleRemove = async () => {
    if (currentKeyRef.current) {
      await remove(currentKeyRef.current);
      currentKeyRef.current = null;
    }
    setPreview(null);
    onChange('imagen_url', '');
  };

  return (
    <FormSection title="Imagen del producto" index={3}>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
      />
      {preview ? (
        <div className="relative inline-block">
          <img src={preview} alt="Vista previa" className="h-32 w-32 object-cover rounded-lg border border-border" />
          <Button
            type="button"
            variant="destructive"
            size="icon-sm"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
            onClick={handleRemove}
          >
            <X size={12} />
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center gap-2 hover:border-primary/50 hover:bg-muted/50 transition-all cursor-pointer disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 size={28} className="text-muted-foreground animate-spin" />
          ) : (
            <Upload size={28} className="text-muted-foreground" />
          )}
          <div className="text-center">
            <p className="text-xs font-medium text-foreground">
              {uploading ? 'Subiendo...' : 'Haz clic para subir imagen'}
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">PNG, JPG, WebP hasta 5MB</p>
          </div>
        </button>
      )}
    </FormSection>
  );
}
