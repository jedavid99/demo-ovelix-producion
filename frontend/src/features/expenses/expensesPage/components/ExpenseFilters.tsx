import { Calendar, Filter, CreditCard, Download } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

interface ExpenseFiltersProps {
  dateFilter: string;
  categoryFilter: string;
  paymentFilter: string;
  onDateChange: (v: string) => void;
  onCategoryChange: (v: string) => void;
  onPaymentChange: (v: string) => void;
}

export function ExpenseFilters({ dateFilter, categoryFilter, paymentFilter, onDateChange, onCategoryChange, onPaymentChange }: ExpenseFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-full">
        <Calendar size={18} className="text-muted-foreground" />
        <select value={dateFilter} onChange={e => onDateChange(e.target.value)}
          className="bg-transparent border-none text-sm font-medium p-0 focus:ring-0 cursor-pointer text-foreground">
          <option value="last-30">Últimos 30 días</option>
          <option value="this-month">Este mes</option>
          <option value="last-quarter">Último trimestre</option>
        </select>
      </div>
      <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-full">
        <Filter size={18} className="text-muted-foreground" />
        <select value={categoryFilter} onChange={e => onCategoryChange(e.target.value)}
          className="bg-transparent border-none text-sm font-medium p-0 focus:ring-0 cursor-pointer text-foreground">
          <option value="all">Todas las categorías</option>
          <option value="spare_parts">Repuestos</option>
          <option value="utilities">Servicios</option>
          <option value="rent">Alquiler</option>
          <option value="salaries">Salarios</option>
          <option value="marketing">Marketing</option>
          <option value="other">Otros</option>
        </select>
      </div>
      <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-full">
        <CreditCard size={18} className="text-muted-foreground" />
        <select value={paymentFilter} onChange={e => onPaymentChange(e.target.value)}
          className="bg-transparent border-none text-sm font-medium p-0 focus:ring-0 cursor-pointer text-foreground">
          <option value="all">Todos los métodos</option>
          <option value="efectivo">Efectivo</option>
          <option value="tarjeta">Tarjeta</option>
          <option value="transferencia">Transferencia</option>
        </select>
      </div>
      <Button variant="outline" size="sm" className="ml-auto">
        <Download size={16} className="mr-2" />
        Exportar
      </Button>
    </div>
  );
}
