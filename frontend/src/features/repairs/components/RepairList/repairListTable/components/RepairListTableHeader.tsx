import { Hash, User, Smartphone, Tag, Wrench, Info } from 'lucide-react';

export function RepairListTableHeader() {
  return (
    <thead className="sticky top-0 bg-card/80 backdrop-blur-sm">
      <tr className="border-b">
        <th className="px-3 py-2 text-left font-medium text-muted-foreground uppercase tracking-wider w-20">
          <span className="flex items-center gap-1"><Hash size={12} /> Orden</span>
        </th>
        <th className="px-3 py-2 text-left font-medium text-muted-foreground uppercase tracking-wider w-32">
          <span className="flex items-center gap-1"><User size={12} /> Cliente</span>
        </th>
        <th className="px-3 py-2 text-left font-medium text-muted-foreground uppercase tracking-wider w-28">
          <span className="flex items-center gap-1"><Smartphone size={12} /> Dispositivo</span>
        </th>
        <th className="hidden md:table-cell px-3 py-2 text-left font-medium text-muted-foreground uppercase tracking-wider w-24">
          <span className="flex items-center gap-1"><Tag size={12} /> Categoría</span>
        </th>
        <th className="px-3 py-2 text-left font-medium text-muted-foreground uppercase tracking-wider w-28">
          <span className="flex items-center gap-1"><Wrench size={12} /> Problema</span>
        </th>
        <th className="hidden lg:table-cell px-3 py-2 text-left font-medium text-muted-foreground uppercase tracking-wider w-28">
          <span className="flex items-center gap-1"><Info size={12} /> Diagnóstico</span>
        </th>
        <th className="px-3 py-2 text-left font-medium text-muted-foreground uppercase tracking-wider w-24">Estado</th>
        <th className="hidden sm:table-cell px-3 py-2 text-left font-medium text-muted-foreground uppercase tracking-wider w-20">Prioridad</th>
        <th className="px-3 py-2 text-right font-medium text-muted-foreground uppercase tracking-wider w-10">Acciones</th>
      </tr>
    </thead>
  );
}
