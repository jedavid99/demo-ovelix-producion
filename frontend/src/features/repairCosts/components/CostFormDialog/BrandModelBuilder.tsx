import { useMemo, useState, type ReactNode } from 'react';
import { Plus, X, MonitorSmartphone } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import type { BrandOption } from '../../types/repairCosts.types';

interface BrandModelBuilderProps {
  brands: BrandOption[];
  selectedMarcas: string[];
  selectedModelos: { marca: string; nombre: string }[];
  onChange: (marcas: string[], modelos: { marca: string; nombre: string }[]) => void;
}

function Choice({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
        active
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border text-muted-foreground hover:border-primary hover:text-primary'
      }`}
    >
      {children}
    </button>
  );
}

export function BrandModelBuilder({ brands, selectedMarcas, selectedModelos, onChange }: BrandModelBuilderProps) {
  const [customBrands, setCustomBrands] = useState<string[]>([]);
  const [sessionModels, setSessionModels] = useState<{ marca: string; nombre: string }[]>([]);
  const [newBrand, setNewBrand] = useState('');
  const [newModelByBrand, setNewModelByBrand] = useState<Record<string, string>>({});
  const [mode, setMode] = useState<'all' | 'specific'>(selectedMarcas.length > 0 ? 'specific' : 'all');

  const allBrands = useMemo(
    () => Array.from(new Set([...brands.map((b) => b.nombre), ...customBrands])).sort((a, b) => a.localeCompare(b)),
    [brands, customBrands],
  );

  const allBrandsMode = mode === 'all';

  const modelsFor = (marca: string): string[] => {
    const fromCatalog = brands.find((b) => b.nombre === marca)?.modelos.map((m) => m.nombre) ?? [];
    const fromSession = sessionModels.filter((m) => m.marca === marca).map((m) => m.nombre);
    return Array.from(new Set([...fromCatalog, ...fromSession])).sort((a, b) => a.localeCompare(b));
  };

  const selectedModelsFor = (marca: string): string[] =>
    selectedModelos.filter((m) => m.marca === marca).map((m) => m.nombre);

  const clearAll = () => {
    onChange([], []);
    setMode('all');
    setNewBrand('');
  };

  const selectAllForBrand = (marca: string) => {
    onChange(
      selectedMarcas,
      selectedModelos.filter((m) => m.marca !== marca),
    );
  };

  const toggleBrand = (nombre: string) => {
    if (selectedMarcas.includes(nombre)) {
      onChange(
        selectedMarcas.filter((m) => m !== nombre),
        selectedModelos.filter((m) => m.marca !== nombre),
      );
    } else {
      setMode('specific');
      onChange([...selectedMarcas, nombre], selectedModelos);
    }
  };

  const toggleModel = (marca: string, nombre: string) => {
    const has = selectedModelos.some((m) => m.marca === marca && m.nombre === nombre);
    if (has) {
      onChange(
        selectedMarcas,
        selectedModelos.filter((m) => !(m.marca === marca && m.nombre === nombre)),
      );
    } else {
      onChange([...selectedMarcas], [...selectedModelos, { marca, nombre }]);
    }
  };

  const addBrand = () => {
    const nombre = newBrand.trim();
    if (!nombre) return;
    if (allBrands.includes(nombre)) {
      setNewBrand('');
      toggleBrand(nombre);
      return;
    }
    setCustomBrands((prev) => [...prev, nombre]);
    setNewBrand('');
    setMode('specific');
    onChange([...selectedMarcas, nombre], selectedModelos);
  };

  const addModel = (marca: string) => {
    const nombre = (newModelByBrand[marca] ?? '').trim();
    if (!nombre) return;
    const exists = selectedModelos.some((m) => m.marca === marca && m.nombre === nombre);
    if (!exists) {
      onChange([...selectedMarcas], [...selectedModelos, { marca, nombre }]);
    }
    if (!sessionModels.some((m) => m.marca === marca && m.nombre === nombre)) {
      setSessionModels((prev) => [...prev, { marca, nombre }]);
    }
    setNewModelByBrand((prev) => ({ ...prev, [marca]: '' }));
  };

  const totalModelos = selectedMarcas.reduce((acc, marca) => acc + selectedModelsFor(marca).length, 0);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Choice active={allBrandsMode} onClick={clearAll}>
          Todas las marcas
        </Choice>
        <Choice active={!allBrandsMode} onClick={() => setMode('specific')}>
          Marcas específicas
        </Choice>
        {!allBrandsMode && (
          <span className="text-[11px] font-semibold text-muted-foreground">
            {selectedMarcas.length} marca{selectedMarcas.length === 1 ? '' : 's'} · {totalModelos} modelo
            {totalModelos === 1 ? '' : 's'}
          </span>
        )}
      </div>

      {allBrandsMode ? (
        <div className="rounded-lg border border-dashed border-border p-3 flex items-start gap-2.5">
          <MonitorSmartphone size={16} className="mt-0.5 shrink-0 text-muted-foreground" />
          <div className="space-y-1 flex-1">
            <p className="text-xs font-semibold text-foreground">Esta solución aplica a todas las marcas y modelos</p>
            <p className="text-xs text-muted-foreground">
              Cambiá a "Marcas específicas" si querés limitarla a ciertos equipos.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
            {allBrands.map((nombre) => {
              const active = selectedMarcas.includes(nombre);
              return (
                <button
                  key={nombre}
                  type="button"
                  onClick={() => toggleBrand(nombre)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                    active
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border text-muted-foreground hover:border-primary hover:text-primary'
                  }`}
                >
                  {nombre}
                  {active && <X size={12} />}
                </button>
              );
            })}
          </div>

          {allBrands.length === 0 && (
            <p className="text-xs text-muted-foreground">
              Todavía no hay marcas cargadas. Agregá la primera abajo y se guardará para reutilizarla.
            </p>
          )}

          <div className="flex gap-2">
            <Input
              value={newBrand}
              onChange={(e) => setNewBrand(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addBrand();
                }
              }}
              placeholder={allBrands.length === 0 ? 'ej: Samsung, Sony, Motorola…' : 'Agregar otra marca… ej: Xiaomi'}
              className="h-9 text-sm"
            />
            <button
              type="button"
              onClick={addBrand}
              className="inline-flex items-center gap-1 rounded-lg border border-input px-3 text-xs font-semibold text-foreground hover:border-primary hover:text-primary transition-colors"
            >
              <Plus size={14} /> Agregar
            </button>
          </div>

          <div className="space-y-3">
            {selectedMarcas.map((marca) => {
              const modelos = modelsFor(marca);
              const sel = selectedModelsFor(marca);
              const allModelsMode = sel.length === 0;
              return (
                <div key={marca} className="rounded-lg border border-border p-3 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Label className="uppercase tracking-wider text-xs">{marca}</Label>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Choice active={allModelsMode} onClick={() => selectAllForBrand(marca)}>
                        Todos los modelos
                      </Choice>
                      <Choice active={!allModelsMode} onClick={() => undefined}>
                        Solo estos modelos
                      </Choice>
                    </div>
                  </div>

                  {!allModelsMode && (
                    <>
                      {modelos.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {modelos.map((nombre) => {
                            const active = sel.includes(nombre);
                            return (
                              <button
                                key={nombre}
                                type="button"
                                onClick={() => toggleModel(marca, nombre)}
                                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold transition-colors ${
                                  active
                                    ? 'border-secondary bg-secondary text-secondary-foreground'
                                    : 'border-border text-muted-foreground hover:border-secondary hover:text-secondary'
                                }`}
                              >
                                {nombre}
                                {active && <X size={11} />}
                              </button>
                            );
                          })}
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Input
                          value={newModelByBrand[marca] ?? ''}
                          onChange={(e) => setNewModelByBrand((prev) => ({ ...prev, [marca]: e.target.value }))}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addModel(marca);
                            }
                          }}
                          placeholder={`Modelo de ${marca}… ej: S22`}
                          className="h-8 text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => addModel(marca)}
                          className="inline-flex items-center gap-1 rounded-lg border border-input px-3 text-xs font-semibold text-foreground hover:border-secondary hover:text-secondary transition-colors"
                        >
                          <Plus size={13} /> Agregar
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}