import { useState, useCallback } from 'react';
import { uploadService, UploadResult } from '@/services/uploadService';
import { toast } from '@/shared/components/ui/use-toast';

interface UseUploadOptions {
  folder?: string;
  onSuccess?: (result: UploadResult) => void;
  onError?: (error: Error) => void;
}

interface UseUploadReturn {
  uploading: boolean;
  upload: (file: File) => Promise<UploadResult | null>;
  remove: (key: string) => Promise<void>;
}

export function useUpload(options: UseUploadOptions = {}): UseUploadReturn {
  const { folder = 'uploads', onSuccess, onError } = options;
  const [uploading, setUploading] = useState(false);

  const upload = useCallback(
    async (file: File): Promise<UploadResult | null> => {
      setUploading(true);
      try {
        const result = await uploadService.uploadFile(file, folder);
        onSuccess?.(result);
        return result;
      } catch (error) {
        const msg = error instanceof Error ? error.message : 'Error al subir archivo';
        toast({ title: 'Error', description: msg, variant: 'destructive' });
        onError?.(error instanceof Error ? error : new Error(msg));
        return null;
      } finally {
        setUploading(false);
      }
    },
    [folder, onSuccess, onError],
  );

  const remove = useCallback(async (key: string) => {
    try {
      await uploadService.deleteFile(key);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') console.error('Error deleting file:', error);
    }
  }, []);

  return { uploading, upload, remove };
}
