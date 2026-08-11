import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, Calendar, FileText } from 'lucide-react';
import { UseQuickRepairReturn } from '../../types/quickRepair/quickRepair.types';

const paymentMethods = [
  { value: 'efectivo', label: 'Efectivo' },
  { value: 'tarjeta', label: 'Tarjeta' },
  { value: 'transferencia', label: 'Transferencia' },
  { value: 'mercado_pago', label: 'Mercado Pago' },
  { value: 'cheque', label: 'Cheque' },
];

const QuickRepairStep4: React.FC<UseQuickRepairReturn> = ({
  DEVICE_TYPES,
  selectedClient, selectedDeviceType, selectedBrand, model,
  issue, priority,
  securityType, selectedAccessories,
  estimatedCost, setEstimatedCost,
  deposit, setDeposit,
  paymentMethod, setPaymentMethod,
  estimatedDate, setEstimatedDate,
  notes, setNotes,
  tieneGarantia, setTieneGarantia,
  garantiaDuracion, setGarantiaDuracion,
  garantiaUnidad, setGarantiaUnidad,
  fechaInicioGarantia, setFechaInicioGarantia,
  getSecurityLabel, getAccessories,
}) => (
  <motion.div
    key="step4"
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 20 }}
    transition={{ duration: 0.25 }}
    className="space-y-5"
  >
    <div>
      <h3 className="text-lg font-bold text-foreground mb-1">Costo del Servicio</h3>
      <p className="text-sm text-muted-foreground mb-4">Ingresa el costo del servicio realizado</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="qr-cost" className="flex items-center gap-1 text-xs font-semibold text-foreground mb-1">
            <DollarSign className="w-3.5 h-3.5 text-primary" />
            Costo del Servicio
          </label>
          <input
            id="qr-cost"
            type="number"
            value={estimatedCost}
            onChange={(e) => setEstimatedCost(e.target.value)}
            placeholder="0.00"
            step="0.01"
            className="w-full px-3 py-2.5 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
          />
        </div>

        <div>
          <label htmlFor="qr-total" className="flex items-center gap-1 text-xs font-semibold text-foreground mb-1">
            <DollarSign className="w-3.5 h-3.5 text-primary" />
            Total a Pagar
          </label>
          <input
            id="qr-total"
            type="number"
            value={estimatedCost}
            readOnly
            placeholder="0.00"
            step="0.01"
            className="w-full px-3 py-2.5 border-2 border-border rounded-lg bg-muted text-sm"
          />
        </div>

        <div>
          <label htmlFor="qr-deposit" className="flex items-center gap-1 text-xs font-semibold text-foreground mb-1">
            <DollarSign className="w-3.5 h-3.5 text-primary" />
            Abono
          </label>
          <input
            id="qr-deposit"
            type="number"
            value={deposit}
            onChange={(e) => setDeposit(e.target.value)}
            placeholder="0.00"
            step="0.01"
            className="w-full px-3 py-2.5 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
          />
        </div>

        <div>
          <label htmlFor="qr-payment" className="flex items-center gap-1 text-xs font-semibold text-foreground mb-1">
            <DollarSign className="w-3.5 h-3.5 text-primary" />
            Forma de Pago
          </label>
          <select
            id="qr-payment"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full px-3 py-2.5 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
          >
            <option value="">Seleccionar</option>
            {paymentMethods.map(pm => (
              <option key={pm.value} value={pm.value}>{pm.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="qr-date" className="flex items-center gap-1 text-xs font-semibold text-foreground mb-1">
            <Calendar className="w-3.5 h-3.5 text-primary" />
            Fecha Estimada
          </label>
          <input
            id="qr-date"
            type="date"
            value={estimatedDate}
            onChange={(e) => setEstimatedDate(e.target.value)}
            className="w-full px-3 py-2.5 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
          />
        </div>
      </div>

      <div className="bg-primary/5 border border-blue-200 rounded-lg p-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={tieneGarantia}
            onChange={(e) => setTieneGarantia(e.target.checked)}
            className="w-4 h-4 text-primary rounded focus:ring-2 focus:ring-ring"
          />
          <span className="text-sm font-semibold text-primary">Incluir Garantía</span>
        </label>

        <AnimatePresence>
          {tieneGarantia && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3"
            >
              <div>
                <label htmlFor="qr-garantia-duration" className="block text-xs font-semibold text-foreground mb-1">Duración</label>
                <input
                  id="qr-garantia-duration"
                  type="number"
                  value={garantiaDuracion}
                  onChange={(e) => setGarantiaDuracion(e.target.value)}
                  placeholder="Ej: 6"
                  min="1"
                  className="w-full px-3 py-2.5 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                />
              </div>
              <div>
                <label htmlFor="qr-garantia-unit" className="block text-xs font-semibold text-foreground mb-1">Unidad</label>
                <select
                  id="qr-garantia-unit"
                  value={garantiaUnidad}
                  onChange={(e) => setGarantiaUnidad(e.target.value)}
                  className="w-full px-3 py-2.5 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                >
                  <option value="MESES">Meses</option>
                  <option value="DIAS">Días</option>
                </select>
              </div>
              <div className="col-span-2">
                <label htmlFor="qr-garantia-start" className="block text-xs font-semibold text-foreground mb-1">Fecha Inicio (opcional)</label>
                <input
                  id="qr-garantia-start"
                  type="date"
                  value={fechaInicioGarantia}
                  onChange={(e) => setFechaInicioGarantia(e.target.value)}
                  className="w-full px-3 py-2.5 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                />
                <p className="text-xs text-muted-foreground mt-1">Si no se especifica, se usará la fecha de entrega</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div>
        <label htmlFor="qr-notes" className="block text-xs font-semibold text-foreground mb-1">Notas Adicionales</label>
        <textarea
          id="qr-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Información adicional..."
          rows={3}
          className="w-full px-3 py-2.5 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm resize-none"
        />
      </div>
    </div>

    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-muted rounded-xl border border-border"
    >
      <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
        <FileText className="w-4 h-4 text-primary" /> Resumen
      </h4>
      <div className="space-y-1.5 text-sm">
        <div className="flex justify-between"><span className="text-muted-foreground">Cliente:</span><span className="font-medium">{selectedClient?.nombre_completo}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Dispositivo:</span><span className="font-medium">{DEVICE_TYPES.find(d => d.id === selectedDeviceType)?.name} {selectedBrand} {model}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Problema:</span><span className="font-medium truncate max-w-[150px]">{issue}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Prioridad:</span><span className="font-medium capitalize">{priority}</span></div>
        {securityType && <div className="flex justify-between"><span className="text-muted-foreground">Seguridad:</span><span className="font-medium">{getSecurityLabel(securityType)}</span></div>}
        {selectedAccessories.length > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Accesorios:</span>
            <span className="font-medium text-right">{selectedAccessories.map(id => getAccessories().find(a => a.id === id)?.label).join(', ')}</span>
          </div>
        )}
        <div className="border-t pt-2 mt-2 space-y-1">
          <div className="flex justify-between font-bold text-primary"><span>Precio de la Reparación:</span><span>${estimatedCost ? parseFloat(estimatedCost).toFixed(2) : '0.00'}</span></div>
          {deposit && <div className="flex justify-between text-success"><span>Abono:</span><span>-${parseFloat(deposit).toFixed(2)}</span></div>}
          <div className="flex justify-between font-bold text-green-700"><span>Saldo a Pagar:</span><span>${((estimatedCost ? parseFloat(estimatedCost) : 0) - (deposit ? parseFloat(deposit) : 0)).toFixed(2)}</span></div>
        </div>
        {paymentMethod && <div className="flex justify-between pt-1"><span className="text-muted-foreground">Forma de Pago:</span><span className="font-medium capitalize">{paymentMethod.replace(/_/g, ' ')}</span></div>}
      </div>
    </motion.div>
  </motion.div>
);

export default QuickRepairStep4;
