import { Download, Upload, Plus } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

interface StockHeaderProps {
  onNavigateAdd: () => void;
  onExport: () => void;
  onImport: () => void;
}

export const StockHeader = ({ onNavigateAdd, onExport, onImport }: StockHeaderProps) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-foreground">Inventario</h1>
      <p className="text-sm text-muted-foreground mt-0.5">Gestiona tu stock de productos y repuestos</p>
    </div>
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={onImport}>
        <Upload size={16} className="mr-1.5" /> Importar
      </Button>
      <Button variant="outline" size="sm" onClick={onExport}>
        <Download size={16} className="mr-1.5" /> Exportar Excel
      </Button>
      <Button size="sm" onClick={onNavigateAdd}>
        <Plus size={16} className="mr-1.5" /> Agregar
      </Button>
    </div>
  </div>
);
