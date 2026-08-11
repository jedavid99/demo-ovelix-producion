import React from 'react';
import { Download, Plus } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

interface StockHeaderProps {
  onNavigateAdd: () => void;
}

export const StockHeader = ({ onNavigateAdd }: StockHeaderProps) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-foreground">Inventario</h1>
      <p className="text-sm text-muted-foreground mt-0.5">Gestiona tu stock de productos y repuestos</p>
    </div>
    <div className="flex items-center gap-3">
      <Button variant="outline" size="sm"><Download size={16} className="mr-2" /> Exportar</Button>
      <Button onClick={onNavigateAdd}><Plus size={16} className="mr-2" /> Agregar producto</Button>
    </div>
  </div>
);
