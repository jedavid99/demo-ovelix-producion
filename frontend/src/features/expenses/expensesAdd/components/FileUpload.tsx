import { Cloud, X } from 'lucide-react';
import { MdAttachFile } from 'react-icons/md';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';

interface FileUploadProps {
  file: File | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
}

export function FileUpload({ file, onFileChange, onClear }: FileUploadProps) {
  return (
    <div className="border-t border-border pt-4">
      <div className="flex items-center gap-3">
        <Cloud size={18} className="text-primary flex-shrink-0" />
        <span className="text-sm font-medium text-foreground">Comprobante</span>
        <label
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 border-2 border-dashed rounded-lg cursor-pointer transition-all hover:border-primary/50 hover:bg-muted/20 text-sm ${
            file ? 'border-primary/50 bg-muted/20' : 'border-border'
          }`}
        >
          <Cloud size={18} className="text-muted-foreground/60" />
          <span className="text-muted-foreground">
            {file ? file.name : 'Subir factura o recibo (PNG, JPG, PDF)'}
          </span>
          <input onChange={onFileChange} className="hidden" type="file" accept=".png,.jpg,.jpeg,.pdf" />
        </label>
        {file && (
          <Button type="button" variant="ghost" size="icon-sm" onClick={onClear}
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
          >
            <X size={16} />
          </Button>
        )}
      </div>
      {file && (
        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
          <MdAttachFile size={14} />
          <span>{file.name}</span>
          <Badge variant="outline" className="text-[10px]">{(file.size / 1024).toFixed(1)} KB</Badge>
        </div>
      )}
    </div>
  );
}
