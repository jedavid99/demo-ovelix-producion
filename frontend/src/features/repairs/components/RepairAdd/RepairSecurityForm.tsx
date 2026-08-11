import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Lock, Fingerprint } from 'lucide-react';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';

interface RepairSecurityFormProps {
  deviceType: string;
  securityType: string;
  accessPin: string;
  hardwareChecks: Record<string, boolean>;
  currentHardwareItems: Array<{ key: string; label: string; icon: any }>;
  currentSecurityOptions: Array<{ id: string; label: string; icon: any }>;
  functionalCount: number;
  onSecurityTypeChange: (type: string) => void;
  onAccessPinChange: (pin: string) => void;
  onHardwareToggle: (key: string) => void;
}

export const RepairSecurityForm: React.FC<RepairSecurityFormProps> = ({
  deviceType,
  securityType,
  accessPin,
  hardwareChecks,
  currentHardwareItems,
  currentSecurityOptions,
  functionalCount,
  onSecurityTypeChange,
  onAccessPinChange,
  onHardwareToggle,
}) => {
  return (
    <>
      {/* Chequeo rápido de hardware (dinámico) */}
      <AnimatePresence mode="wait">
        {deviceType && currentHardwareItems.length > 0 && (
          <motion.section
            key={deviceType}
            initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-card rounded-2xl p-4 shadow-sm border border-border"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-primary/10 text-primary p-2 rounded-xl">
                <CheckCircle2 size={18} />
              </div>
              <h2 className="text-base font-bold text-foreground">Chequeo rápido de hardware</h2>
              <Badge variant="outline" className="ml-auto text-xs">{functionalCount}/{currentHardwareItems.length} funcionales</Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
              {currentHardwareItems.map((item) => {
                const Icon = item.icon;
                const isChecked = hardwareChecks[item.key] ?? false;
                return (
                  <div
                    key={item.key}
                    className="flex items-center justify-between p-2 bg-muted rounded-xl border border-border hover:border-border transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Icon size={16} className={isChecked ? 'text-primary' : 'text-muted-foreground'} />
                      <span className="text-xs font-medium text-foreground">{item.label}</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => onHardwareToggle(item.key)}
                        className="sr-only"
                      />
                      <div className={`w-8 h-4 rounded-full transition-colors ${isChecked ? 'bg-primary' : 'bg-muted'}`}>
                        <div
                          className={`absolute left-0.5 top-0.5 bg-card w-3 h-3 rounded-full transition-transform shadow-sm ${
                            isChecked ? 'translate-x-4' : ''
                          }`}
                        />
                      </div>
                    </label>
                  </div>
                );
              })}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Seguridad y Acceso (dinámico) */}
      <AnimatePresence mode="wait">
        {deviceType && currentSecurityOptions.length > 0 && (
          <motion.section
            key={`security-${deviceType}`}
            initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-card rounded-2xl p-4 shadow-sm border border-border"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-warning/10 text-warning p-2 rounded-xl">
                <Lock size={18} />
              </div>
              <h2 className="text-base font-bold text-foreground">Seguridad y Acceso</h2>
            </div>
            <div className="flex gap-2 mb-4">
              {currentSecurityOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = securityType === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => onSecurityTypeChange(opt.id)}
                    className={`flex items-center gap-2 px-4 py-1.5 text-xs font-bold rounded-full border transition-all ${
                      isSelected
                        ? 'bg-primary/5 border-primary text-primary'
                        : 'bg-muted border-border text-muted-foreground hover:border-primary/30'
                    }`}
                  >
                    <Icon size={14} />
                    {opt.label}
                  </button>
                );
              })}
            </div>
            {securityType === 'pin' && (
              <div className="max-w-xs">
                <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                  {deviceType === 'phone' ? 'PIN' : 'Contraseña'}
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={accessPin}
                    onChange={(e) => onAccessPinChange(e.target.value)}
                    placeholder="••••••"
                    className="w-full pl-8 pr-3 py-2.5 bg-muted border border-border rounded-lg focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-mono text-sm text-foreground"
                  />
                  <Lock size={16} className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>
            )}
            {securityType === 'patron' && (
              <div className="flex flex-col items-start gap-3">
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Dibuja el patrón (3x3)</p>
                <div className="relative bg-card p-4 rounded-2xl border-2 border-primary/20 shadow-md" style={{ width: '200px', height: '200px' }}>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full h-full">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div key={i} className="w-full h-full bg-muted rounded-full hover:bg-primary/20 transition-colors" />
                    ))}
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-xs">Limpiar patrón</Button>
              </div>
            )}
            {securityType === 'huella' && (
              <div className="flex items-center gap-3">
                <Fingerprint size={24} className="text-primary" />
                <span className="text-sm text-foreground">Dispositivo con lector de huellas</span>
              </div>
            )}
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
};
