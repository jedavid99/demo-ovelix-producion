import { Download, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export function InventoryHeader() {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Inventario iPhone</h2>
        <p className="text-muted-foreground dark:text-muted-foreground">Monitoreo de stock y gesti\u00F3n de activos en tiempo real</p>
      </div>
      <div className="flex gap-3">
        <button className="flex items-center gap-2 px-4 py-2 border border-border  rounded-lg text-foreground dark:text-muted-foreground hover:bg-muted dark:hover:bg-muted transition-all font-medium">
          <Download size={18} />
          <span>Exportar CSV</span>
        </button>
        <Link to="/stock/iphone-add">
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 font-medium">
            <Plus size={18} />
            <span>Agregar nuevo stock</span>
          </button>
        </Link>
      </div>
    </div>
  );
}
