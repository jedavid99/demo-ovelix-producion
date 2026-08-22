import { Upload, X, Loader2 } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import { useUpload } from '@/shared/hooks/useUpload';

interface LogoSectionProps {
  logoUrl: string;
  businessName: string;
  onFieldChange: (name: string, value: string) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  getInitials: (name: string) => string;
}

export function LogoSection({ logoUrl, businessName, onFieldChange, onInputChange, getInitials }: LogoSectionProps) {
  const { upload, uploading } = useUpload({ folder: 'business/logo' });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const result = await upload(file);
    if (result) {
      onFieldChange('logo_url', result.url);
    }
  };

  return (
    <div className="bg-muted dark:bg-muted/50 rounded-xl p-6 space-y-4">
      <h3 className="text-sm font-semibold text-foreground dark:text-muted-foreground uppercase tracking-wider flex items-center gap-2">
        <Upload className="w-4 h-4" /> Logo de la Empresa
      </h3>
      <div className="flex items-start gap-4">
        {logoUrl ? (
          <div className="relative">
            <img src={logoUrl} alt="Logo de la empresa" loading="lazy" className="w-24 h-24 object-contain border border-border dark:border-border rounded-lg" />
            <button type="button" onClick={() => onFieldChange('logo_url', '')}
              className="absolute -top-2 -right-2 bg-destructive/100 text-white rounded-full p-1 hover:bg-destructive transition-colors">
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div className="w-24 h-24 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/20">
            {uploading ? (
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
            ) : (
              <span className="text-xl font-bold text-primary">{getInitials(businessName)}</span>
            )}
          </div>
        )}
        <div className="flex-1 space-y-2">
          <label className="text-sm font-medium">Subir Logo</label>
          <Input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
            onChange={handleFileUpload}
            disabled={uploading}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">Sube una imagen cuadrada de al menos 200x200px.</p>
          <div className="relative mt-2">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-muted px-2 text-muted-foreground">o</span></div>
          </div>
          <label htmlFor="logo-url" className="text-sm font-medium">URL del Logo</label>
          <Input id="logo-url" type="url" name="logo_url" value={logoUrl} onChange={onInputChange} placeholder="https://example.com/logo.png" className="w-full" />
        </div>
      </div>
    </div>
  );
}
