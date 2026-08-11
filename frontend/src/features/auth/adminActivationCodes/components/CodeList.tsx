import { motion } from 'framer-motion';
import { Key, CheckCircle2, AlertCircle, Copy, Trash2 } from 'lucide-react';
import { EmptyState } from '@/shared/components/async/EmptyState';
import { Button } from '@/shared/components/ui/button';
import type { ActivationCode } from '../types';

interface CodeListProps {
  codes: ActivationCode[];
  copiedCode: string | null;
  onCopy: (code: string) => void;
  onDelete: (id: string) => void;
}

export function CodeList({ codes, copiedCode, onCopy, onDelete }: CodeListProps) {
  return (
    <div className="bg-card dark:bg-card border border-border/60 rounded-lg">
      <div className="p-6 border-b border-border/60">
        <h2 className="text-lg font-semibold text-foreground">Historial de Códigos</h2>
      </div>
      <div className="divide-y divide-border/60">
        {codes.length === 0 ? (
          <EmptyState icon={Key} title="No hay códigos generados aún" />
        ) : (
          codes.map((code) => (
            <motion.div key={code.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="p-4 hover:bg-muted  transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${code.used ? 'bg-orange-100 dark:bg-orange-900/30' : 'bg-green-100 dark:bg-green-900/30'}`}>
                    {code.used ? (
                      <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-300" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5 text-success dark:text-green-300" />
                    )}
                  </div>
                  <div>
                    <p className="font-mono font-bold text-foreground">{code.code}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Creado: {new Date(code.createdAt).toLocaleDateString()}</span>
                      {code.used && <><span>•</span><span>Usado: {new Date(code.usedAt!).toLocaleDateString()}</span></>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!code.used && (
                    <Button variant="outline" size="sm" onClick={() => onCopy(code.code)} className="flex items-center gap-2">
                      {copiedCode === code.code ? <><CheckCircle2 className="w-4 h-4" /> Copiado</> : <><Copy className="w-4 h-4" /> Copiar</>}
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={() => onDelete(code.id)}
                    className="flex items-center gap-2 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" /> Eliminar
                  </Button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
