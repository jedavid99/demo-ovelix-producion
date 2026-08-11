import React, { useEffect, useRef, useState } from 'react';
import { Filter, Search, ChevronDown } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { STATUS_FILTERS } from './RepairList.types';
import { ESTADOS_CONFIG, ESTADOS_FASES } from '@/config/estadosReparacion.config';

interface RepairListFiltersProps {
  filterStatus: string;
  onFilterStatusChange: (status: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const RepairListFilters: React.FC<RepairListFiltersProps> = ({
  filterStatus,
  onFilterStatusChange,
  searchQuery,
  onSearchChange,
}) => {
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [statusSearchQuery, setStatusSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filtrar estados por búsqueda
  const filteredStatuses = STATUS_FILTERS.filter(status => {
    if (status === 'all') return true;
    const config = ESTADOS_CONFIG[status];
    if (!config) return false;
    return config.label.toLowerCase().includes(statusSearchQuery.toLowerCase());
  });

  // Agrupar estados por fase
  const groupedStatuses = ESTADOS_FASES.reduce((acc, fase) => {
    acc[fase] = filteredStatuses.filter(status => {
      if (status === 'all') return false;
      const config = ESTADOS_CONFIG[status];
      return config?.fase === fase;
    });
    return acc;
  }, {} as Record<string, string[]>);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setStatusDropdownOpen(false);
        setStatusSearchQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Filter size={20} className="text-muted-foreground" />
          <h3 className="text-lg font-semibold text-foreground">Filtros</h3>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          {/* Filtro de Estado - Dropdown mejorado */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-background text-sm hover:bg-accent transition-colors min-w-[180px]"
            >
              <Filter size={16} className="text-muted-foreground" />
              <span className="flex-1 text-left truncate">
                {filterStatus === 'all' ? 'Todos' : ESTADOS_CONFIG[filterStatus]?.label || 'Estado'}
              </span>
              <ChevronDown size={16} className="text-muted-foreground" />
            </button>
            
            {statusDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-80 bg-background border border-border rounded-lg shadow-lg z-50 max-h-[400px] overflow-auto">
                {/* Búsqueda dentro del dropdown */}
                <div className="p-3 border-b border-border sticky top-0 bg-background">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                    <input
                      type="text"
                      placeholder="Buscar estado..."
                      aria-label="Buscar estado"
                      value={statusSearchQuery}
                      onChange={(e) => setStatusSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 rounded-md border border-input bg-background text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* Opción "Todos" */}
                <button
                  onClick={() => {
                    onFilterStatusChange('all');
                    setStatusDropdownOpen(false);
                    setStatusSearchQuery('');
                  }}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-accent transition-colors border-b border-border ${
                    filterStatus === 'all' ? 'bg-accent font-medium' : ''
                  }`}
                >
                  Todos
                </button>

                {/* Estados agrupados por fase */}
                {ESTADOS_FASES.map((fase) => {
                  const faseStates = groupedStatuses[fase];
                  if (!faseStates || faseStates.length === 0) return null;

                  return (
                    <div key={fase}>
                      <div className="px-4 py-1.5 text-xs font-semibold text-muted-foreground bg-muted/50 sticky top-9">
                        {fase}
                      </div>
                      {faseStates.map((status) => (
                        <button
                          key={status}
                          onClick={() => {
                            onFilterStatusChange(status);
                            setStatusDropdownOpen(false);
                            setStatusSearchQuery('');
                          }}
                          className={`w-full px-4 py-2 text-left text-sm hover:bg-accent transition-colors flex items-center gap-2 ${
                            filterStatus === status ? 'bg-accent font-medium' : ''
                          }`}
                        >
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: ESTADOS_CONFIG[status]?.color }}
                          />
                          {ESTADOS_CONFIG[status]?.label}
                        </button>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Búsqueda */}
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input
                type="text"
                placeholder="Buscar por orden, nombre o DNI..."
                aria-label="Buscar por orden, nombre o DNI"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
