import { Image, Cloud, CheckCircle } from 'lucide-react';
import { FormSection } from './FormSection';

export function ImageSection() {
  return (
    <FormSection icon={<Image size={18} className="text-primary" />} title="Imagen del producto" index={4}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="group relative aspect-video w-full rounded-xl border-2 border-dashed border-border bg-muted/30 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-all overflow-hidden p-4">
          <Cloud size={36} className="text-muted-foreground group-hover:text-primary transition-colors mb-2" />
          <p className="text-xs font-medium text-muted-foreground text-center">Haz clic o arrastra</p>
          <p className="text-[10px] text-muted-foreground/60 mt-1">PNG, JPG hasta 10MB</p>
        </div>
        <div className="flex flex-col justify-center space-y-2">
          <h3 className="text-sm font-bold text-foreground">Recomendaciones:</h3>
          <ul className="space-y-1.5 text-xs text-muted-foreground">
            <li className="flex items-start gap-2"><CheckCircle size={14} className="text-primary flex-shrink-0 mt-0.5" /> Foto nítida y de alta resolución sobre fondo blanco.</li>
            <li className="flex items-start gap-2"><CheckCircle size={14} className="text-primary flex-shrink-0 mt-0.5" /> Muestra todos los conectores y cables claramente.</li>
            <li className="flex items-start gap-2"><CheckCircle size={14} className="text-primary flex-shrink-0 mt-0.5" /> Incluye el empaque si los números de serie son visibles.</li>
          </ul>
        </div>
      </div>
    </FormSection>
  );
}
