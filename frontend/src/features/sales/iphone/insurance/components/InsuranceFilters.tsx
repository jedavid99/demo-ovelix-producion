import { FilterX } from 'lucide-react';

interface InsuranceFiltersProps {
  modelFilter: string;
  insuranceFilter: string;
  expirationFilter: string;
  onModelFilterChange: (v: string) => void;
  onInsuranceFilterChange: (v: string) => void;
  onExpirationFilterChange: (v: string) => void;
  onClearFilters: () => void;
}

export function InsuranceFilters({
  modelFilter, insuranceFilter, expirationFilter,
  onModelFilterChange, onInsuranceFilterChange, onExpirationFilterChange, onClearFilters,
}: InsuranceFiltersProps) {
  return (
    <div className="flex gap-3 flex-wrap items-center">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card border border-input">
        <span className="text-xs font-semibold uppercase text-muted-foreground">Modelo:</span>
        <select value={modelFilter} onChange={(e) => onModelFilterChange(e.target.value)}
          className="bg-transparent border-none focus:outline-none text-sm font-semibold text-foreground cursor-pointer"
        >
          <option>Todas las Series</option>
          <option>iPhone 15 Pro</option>
          <option>iPhone 15</option>
          <option>iPhone 14</option>
        </select>
      </div>
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card border border-input">
        <span className="text-xs font-semibold uppercase text-muted-foreground">Seguro:</span>
        <select value={insuranceFilter} onChange={(e) => onInsuranceFilterChange(e.target.value)}
          className="bg-transparent border-none focus:outline-none text-sm font-semibold text-foreground cursor-pointer"
        >
          <option>Estado Activo</option>
          <option>Activo</option>
          <option>Expirado</option>
          <option>Sin Seguro</option>
        </select>
      </div>
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card border border-input">
        <span className="text-xs font-semibold uppercase text-muted-foreground">Vencimiento:</span>
        <select value={expirationFilter} onChange={(e) => onExpirationFilterChange(e.target.value)}
          className="bg-transparent border-none focus:outline-none text-sm font-semibold text-foreground cursor-pointer"
        >
          <option>Próximo a Vencer</option>
          <option>Expirado</option>
          <option>Activo</option>
        </select>
      </div>
      <button onClick={onClearFilters} className="ml-auto text-primary text-sm font-semibold flex items-center gap-1 hover:opacity-80">
        <FilterX size={16} />
        Limpiar Filtros
      </button>
    </div>
  );
}
