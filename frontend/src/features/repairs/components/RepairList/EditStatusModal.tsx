import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Textarea } from '@/shared/components/ui/textarea';
import { ChevronDown } from 'lucide-react';
import { toast } from '@/shared/components/ui/use-toast';
import { repairService } from '@/services/repairService';
import { ESTADOS_CONFIG, ESTADOS_KEYS } from '@/config/estadosReparacion.config';
import { usePermittedStates } from '@/hooks/usePermittedStates';
import api from '@/services/api';

interface EditStatusModalProps {
  open: boolean;
  onClose: () => void;
  repairId: string;
  currentStatus: string;
  onSuccess: () => void;
}


export const EditStatusModal: React.FC<EditStatusModalProps> = ({
  open,
  onClose,
  repairId,
  currentStatus,
  onSuccess,
}) => {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [actualCurrentStatus, setActualCurrentStatus] = useState(currentStatus);
  const [note, setNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loadingRepair, setLoadingRepair] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { permitted, loading: loadingPermitted, error: permittedError } = usePermittedStates(repairId);

  // Al abrir, recargar el estado actual de la reparación
  useEffect(() => {
    if (open && repairId) {
      setLoadingRepair(true);
      api.get(`/repairs/${repairId}`)
        .then((res) => {
          const repairData = res.data?.data || res.data;
          const status = repairData?.estado || currentStatus;
          setActualCurrentStatus(status);
          const exists = ESTADOS_KEYS.includes(status);
          setSelectedStatus(exists ? status : ESTADOS_KEYS[0]);
          setIsDropdownOpen(false);
        })
        .catch((err) => {
          toast({ title: 'Error', description: 'Error al cargar los datos. Intentalo de nuevo.', variant: 'destructive' });
          if (process.env.NODE_ENV === 'development') console.error('Error loading repair status:', err);
          setActualCurrentStatus(currentStatus);
          const exists = ESTADOS_KEYS.includes(currentStatus);
          setSelectedStatus(exists ? currentStatus : ESTADOS_KEYS[0]);
        })
        .finally(() => {
          setLoadingRepair(false);
        });
    }
  }, [open, repairId]);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentOption = ESTADOS_CONFIG[actualCurrentStatus];
  const selectedOption = ESTADOS_CONFIG[selectedStatus];

  const handleSelect = (value: string) => {
    setSelectedStatus(value);
    setIsDropdownOpen(false);
  };

  const handleSave = async () => {
    if (selectedStatus === actualCurrentStatus) {
      onClose();
      return;
    }

    try {
      setIsSaving(true);
      await repairService.updateStatus(repairId, { estado: selectedStatus, nota: note });
      toast({ title: 'Éxito', description: 'Estado actualizado correctamente' });
      onSuccess();
      onClose();
      setNote('');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'No se pudo actualizar el estado',
        variant: 'destructive',
      });
      if (process.env.NODE_ENV === 'development') console.error('Error updating status:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Estado de Reparación</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Estado actual (solo lectura) */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Estado Actual
            </label>
            <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-md">
              <span 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: currentOption?.color || '#95A5A6' }}
              />
              <span className="text-sm">{currentOption?.label || currentStatus}</span>
            </div>
          </div>

          {/* Nuevo estado - Custom Dropdown con todas las opciones habilitadas */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Nuevo Estado
            </label>
            <div ref={dropdownRef} className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: selectedOption?.color || '#95A5A6' }}
                  />
                  <span>{selectedOption?.label || 'Seleccionar'}</span>
                </div>
                <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute z-[999] w-full mt-1 bg-background border border-input rounded-md shadow-lg max-h-60 overflow-auto">
                  {loadingPermitted ? (
                    <div className="px-3 py-2 text-sm text-muted-foreground">Cargando estados...</div>
                  ) : permittedError ? (
                    <>
                      <div className="px-3 py-2 text-xs text-destructive bg-destructive/10">
                        Error cargando estados permitidos. Mostrando todos los estados.
                      </div>
                      {ESTADOS_KEYS.map((estadoKey) => {
                        const config = ESTADOS_CONFIG[estadoKey];
                        return (
                          <button
                            key={estadoKey}
                            type="button"
                            onClick={() => handleSelect(estadoKey)}
                            className="w-full px-3 py-2 text-sm flex items-center gap-2 hover:bg-accent focus:bg-accent focus:outline-none cursor-pointer"
                          >
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: config?.color || '#95A5A6' }}
                            />
                            <span>{config?.label || estadoKey}</span>
                            {estadoKey === selectedStatus && (
                              <span className="ml-auto text-xs text-muted-foreground">✓</span>
                            )}
                          </button>
                        );
                      })}
                    </>
                  ) : permitted.length === 0 ? (
                    <div className="px-3 py-2 text-sm text-muted-foreground">No hay transiciones disponibles</div>
                  ) : (
                    permitted.map((estadoKey) => {
                      const config = ESTADOS_CONFIG[estadoKey];
                      return (
                        <button
                          key={estadoKey}
                          type="button"
                          onClick={() => handleSelect(estadoKey)}
                          className="w-full px-3 py-2 text-sm flex items-center gap-2 hover:bg-accent focus:bg-accent focus:outline-none cursor-pointer"
                        >
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: config?.color || '#95A5A6' }}
                          />
                          <span>{config?.label || estadoKey}</span>
                          {estadoKey === selectedStatus && (
                            <span className="ml-auto text-xs text-muted-foreground">✓</span>
                          )}
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Solo se muestran las transiciones válidas según el estado actual.
            </p>
          </div>

          {/* Nota opcional */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Nota (opcional)
            </label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Agrega una nota sobre este cambio de estado..."
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isSaving || selectedStatus === currentStatus}>
            {isSaving ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};