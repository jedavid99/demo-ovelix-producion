import React from 'react';
import { motion } from 'framer-motion';
import { UseQuickRepairReturn } from '../../types/quickRepair/quickRepair.types';

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Baja', border: 'border-border', bg: 'bg-muted', selectedBg: 'bg-muted' },
  { value: 'medium', label: 'Media', border: 'border-blue-400', bg: 'bg-primary/5', selectedBg: 'bg-primary/10' },
  { value: 'high', label: 'Alta', border: 'border-orange-400', bg: 'bg-orange-50', selectedBg: 'bg-orange-100' },
  { value: 'critical', label: 'Urgente', border: 'border-red-500', bg: 'bg-destructive/10', selectedBg: 'bg-red-100' },
];

const QuickRepairStep3: React.FC<UseQuickRepairReturn> = ({
  issue, setIssue,
  priority, setPriority,
}) => (
  <motion.div
    key="step3"
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 20 }}
    transition={{ duration: 0.25 }}
    className="space-y-5"
  >
    <div>
      <h3 className="text-lg font-bold text-foreground mb-1">Descripción del Problema</h3>
      <p className="text-sm text-muted-foreground mb-4">Describe qué le pasa al dispositivo</p>
      <textarea
        aria-label="Descripción del Problema"
        value={issue}
        onChange={(e) => setIssue(e.target.value)}
        placeholder="Ej: Pantalla rota, no enciende, audio falla..."
        rows={4}
        className="w-full px-3 py-2.5 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm resize-none"
      />
    </div>

    <div>
      <label className="block text-xs font-semibold text-foreground mb-2">Prioridad</label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {PRIORITY_OPTIONS.map((p) => (
          <button
            key={p.value}
            onClick={() => setPriority(p.value)}
            className={`p-3 rounded-lg border-2 transition-all text-sm ${
              priority === p.value
                ? `${p.border} ${p.selectedBg}`
                : `border-border ${p.bg} hover:border-border hover:bg-muted`
            }`}
          >
            <p className="font-semibold">{p.label}</p>
          </button>
        ))}
      </div>
    </div>
  </motion.div>
);

export default QuickRepairStep3;
