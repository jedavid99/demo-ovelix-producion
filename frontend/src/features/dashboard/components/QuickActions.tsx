import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MdAttachMoney,
  MdPersonAdd,
  MdInventory2,
  MdMoneyOff,
  MdBuild,
} from 'react-icons/md';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { RepairStateData } from '../types/dashboard.types';

interface QuickActionsProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  isStatesModalOpen: boolean;
  setIsStatesModalOpen: (open: boolean) => void;
  repairStatesData: RepairStateData[];
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  isModalOpen,
  setIsModalOpen,
  isStatesModalOpen,
  setIsStatesModalOpen,
  repairStatesData,
}) => {
  const navigate = useNavigate();

  return (
    <>
      {/* Modal de Registro de Movimiento */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md bg-card">
          <DialogHeader>
            <DialogTitle>Registrar Movimiento</DialogTitle>
            <DialogDescription>
              Selecciona el tipo de operación que deseas realizar.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            {/* Registrar Venta */}
            <button
              onClick={() => {
                setIsModalOpen(false);
                navigate('/sales/add');
              }}
              className="flex flex-col items-center justify-center gap-3 p-5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-900/30 dark:bg-emerald-950/20 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 group"
            >
              <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <MdAttachMoney size={28} className="text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="text-sm font-semibold text-foreground">Registrar Venta</span>
            </button>

            {/* Agregar Cliente */}
            <button
              onClick={() => {
                setIsModalOpen(false);
                navigate('/clients/add');
              }}
              className="flex flex-col items-center justify-center gap-3 p-5 rounded-xl bg-primary/5 hover:bg-primary/10 border border-blue-200 dark:border-blue-900/30 dark:bg-blue-950/20 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 group"
            >
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <MdPersonAdd size={28} className="text-primary dark:text-blue-400" />
              </div>
              <span className="text-sm font-semibold text-foreground">Agregar Cliente</span>
            </button>

            {/* Agregar Producto */}
            <button
              onClick={() => {
                setIsModalOpen(false);
                navigate('/stock/add');
              }}
              className="flex flex-col items-center justify-center gap-3 p-5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 dark:border-amber-900/30 dark:bg-amber-950/20 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 group"
            >
              <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <MdInventory2 size={28} className="text-amber-600 dark:text-amber-400" />
              </div>
              <span className="text-sm font-semibold text-foreground">Agregar Producto</span>
            </button>

            {/* Nuevo Gasto */}
            <button
              onClick={() => {
                setIsModalOpen(false);
                navigate('/expenses/add');
              }}
              className="flex flex-col items-center justify-center gap-3 p-5 rounded-xl bg-destructive/10 hover:bg-red-100 border border-red-200 dark:border-red-900/30 dark:bg-red-950/20 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 group"
            >
              <div className="h-12 w-12 rounded-full bg-destructive/100/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <MdMoneyOff size={28} className="text-destructive dark:text-destructive" />
              </div>
              <span className="text-sm font-semibold text-foreground">Nuevo Gasto</span>
            </button>

            {/* Nueva Reparación (ocupa toda la fila) */}
            <button
              onClick={() => {
                setIsModalOpen(false);
                navigate('/reparaciones/add');
              }}
              className="col-span-2 flex flex-col items-center justify-center gap-3 p-5 rounded-xl bg-violet-50 hover:bg-violet-100 border border-violet-200 dark:border-violet-900/30 dark:bg-violet-950/20 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 group"
            >
              <div className="h-12 w-12 rounded-full bg-violet-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <MdBuild size={28} className="text-violet-600 dark:text-violet-400" />
              </div>
              <span className="text-sm font-semibold text-foreground">Nueva Reparación</span>
            </button>
          </div>
          <div className="flex justify-end mt-6">
            <Button onClick={() => setIsModalOpen(false)} variant="ghost">
              Cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Estados de Reparación */}
      <Dialog open={isStatesModalOpen} onOpenChange={setIsStatesModalOpen}>
        <DialogContent className="sm:max-w-md bg-card">
          <DialogHeader>
            <DialogTitle>Estados de Reparación</DialogTitle>
            <DialogDescription>Distribución de reparaciones por estado actual</DialogDescription>
          </DialogHeader>
          <div className="mt-6 space-y-3">
            {repairStatesData.length > 0 ? (
              repairStatesData.map((state) => (
                <div
                  key={state.name}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: state.color }}
                    />
                    <span className="text-sm font-medium">{state.name}</span>
                  </div>
                  <Badge variant="secondary">{state.value}</Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No hay datos de estados disponibles
              </p>
            )}
          </div>
          <div className="flex justify-end mt-6">
            <Button onClick={() => setIsStatesModalOpen(false)} variant="ghost">
              Cerrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default QuickActions;
