import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { UseQuickRepairReturn } from '../../types/quickRepair/quickRepair.types';

const QuickRepairStep2: React.FC<UseQuickRepairReturn> = ({
  DEVICE_TYPES,
  selectedDeviceType, setSelectedDeviceType,
  brandSearch, setBrandSearch, selectedBrand, setSelectedBrand,
  showBrandDropdown, setShowBrandDropdown, existingBrands,
  model, setModel, serial, setSerial,
  securityType, setSecurityType, pinCode, setPinCode,
  patternPoints, patternSequence, drawnPattern, canvasRef,
  handleCanvasClick, clearPattern,
  getSecurityOptions, getSecurityLabel,
  selectedAccessories, getAccessories, toggleAccessory,
}) => (
  <motion.div
    key="step2"
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 20 }}
    transition={{ duration: 0.25 }}
    className="space-y-5"
  >
    <div>
      <h3 className="text-lg font-bold text-foreground mb-1">Tipo de Dispositivo</h3>
      <p className="text-sm text-muted-foreground mb-4">Selecciona qué tipo de dispositivo es</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {DEVICE_TYPES.map((device) => {
          const Icon = device.icon;
          const isSelected = selectedDeviceType === device.id;
          return (
            <button
              key={device.id}
              onClick={() => setSelectedDeviceType(device.id)}
              className={`p-4 rounded-xl border-2 transition-all text-center ${
                isSelected
                  ? 'border-blue-500 bg-primary/5 shadow-sm'
                  : 'border-border hover:border-blue-300 hover:bg-muted'
              }`}
            >
              <Icon className={`w-6 h-6 mx-auto mb-2 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
              <p className="text-xs font-semibold text-foreground">{device.name}</p>
            </button>
          );
        })}
      </div>
    </div>

    <AnimatePresence>
      {selectedDeviceType && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          <div>
            <label htmlFor="qr-brand" className="block text-xs font-semibold text-foreground mb-1">Marca</label>
            <div className="relative">
              <input
                id="qr-brand"
                type="text"
                value={brandSearch}
                onChange={(e) => {
                  setBrandSearch(e.target.value);
                  setSelectedBrand(e.target.value);
                  setShowBrandDropdown(true);
                }}
                onFocus={() => setShowBrandDropdown(true)}
                onBlur={() => setTimeout(() => setShowBrandDropdown(false), 200)}
                placeholder="Escribe o selecciona una marca..."
                className="w-full px-3 py-2.5 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              />
              {showBrandDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-card border-2 border-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {existingBrands
                    .filter(brand => brand.toLowerCase().includes(brandSearch.toLowerCase()))
                    .sort((a, b) => a.localeCompare(b))
                    .map((brand) => (
                      <button
                        key={brand}
                        type="button"
                        onClick={() => {
                          setSelectedBrand(brand);
                          setBrandSearch(brand);
                          setShowBrandDropdown(false);
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-primary/5 border-b border-border last:border-b-0 text-sm"
                      >
                        {brand}
                      </button>
                    ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="qr-model" className="block text-xs font-semibold text-foreground mb-1">Modelo</label>
            <input
              id="qr-model"
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="Ej: iPhone 13 Pro Max"
              className="w-full px-3 py-2.5 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
            />
          </div>

          <div>
            <label htmlFor="qr-serial" className="block text-xs font-semibold text-foreground mb-1">Serial / IMEI (opcional)</label>
            <input
              id="qr-serial"
              type="text"
              value={serial}
              onChange={(e) => setSerial(e.target.value)}
              placeholder="Ej: ABC123XYZ"
              className="w-full px-3 py-2.5 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
            />
          </div>

          <div>
            <label htmlFor="qr-security" className="block text-xs font-semibold text-foreground mb-1">Tipo de Seguridad (opcional)</label>
            <select
              id="qr-security"
              value={securityType}
              onChange={(e) => setSecurityType(e.target.value)}
              className="w-full px-3 py-2.5 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
            >
              {getSecurityOptions().map(option => (
                <option key={option} value={option}>{getSecurityLabel(option)}</option>
              ))}
            </select>
          </div>

          {securityType === 'pin' && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="space-y-1"
            >
              <label htmlFor="qr-pin" className="block text-xs font-semibold text-foreground mb-1">PIN / Contraseña</label>
              <input
                id="qr-pin"
                type="text"
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
                placeholder="Ej: 1234"
                className="w-full px-3 py-2.5 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              />
            </motion.div>
          )}

          {securityType === 'pattern' && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1">Dibuja el patrón de desbloqueo</label>
                <p className="text-xs text-muted-foreground mb-3">Haz clic en los puntos en el orden correcto (mínimo 4 puntos)</p>
                <div className="flex flex-col items-center">
                  <div className="p-2 bg-muted rounded-xl border-2 border-border shadow-inner">
                    <canvas
                      ref={canvasRef}
                      width={300}
                      height={300}
                      onClick={handleCanvasClick}
                      className="rounded-lg cursor-pointer bg-card w-full max-w-[280px] h-auto touch-none"
                      style={{ touchAction: 'none' }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={clearPattern}
                    className="mt-3 flex items-center gap-1.5 px-4 py-2 bg-card border border-border rounded-lg hover:bg-muted text-sm font-medium text-foreground transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" /> Limpiar patrón
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="qr-pattern-points" className="block text-xs font-semibold text-foreground mb-1">Puntos (IDs)</label>
                  <input
                    id="qr-pattern-points"
                    type="text"
                    value={patternPoints}
                    readOnly
                    placeholder="Ej: 1,2,3,6,9"
                    className="w-full px-3 py-2 border-2 border-border rounded-lg bg-muted text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="qr-pattern-sequence" className="block text-xs font-semibold text-foreground mb-1">Secuencia</label>
                  <input
                    id="qr-pattern-sequence"
                    type="text"
                    value={patternSequence}
                    readOnly
                    placeholder="Ej: 1,2,3,6,9"
                    className="w-full px-3 py-2 border-2 border-border rounded-lg bg-muted text-sm"
                  />
                </div>
              </div>
            </motion.div>
          )}

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">Accesorios entregados (opcional)</label>
            <p className="text-xs text-muted-foreground mb-2">Selecciona los que dejó el cliente</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {getAccessories().map(accessory => (
                <label
                  key={accessory.id}
                  className={`flex items-center gap-2 p-2.5 border-2 rounded-lg cursor-pointer transition-all text-sm ${
                    selectedAccessories.includes(accessory.id)
                      ? 'border-blue-500 bg-primary/5'
                      : 'border-border hover:border-blue-300 hover:bg-muted'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedAccessories.includes(accessory.id)}
                    onChange={() => toggleAccessory(accessory.id)}
                    className="w-3.5 h-3.5 text-primary rounded"
                  />
                  <span>{accessory.label}</span>
                </label>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

export default QuickRepairStep2;
