import { motion, AnimatePresence } from 'framer-motion';
import { Plus, RefreshCw, CheckCircle2, Copy } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';

interface GenerateCodeSectionProps {
  isGenerating: boolean;
  newCode: string;
  copiedCode: string | null;
  onGenerate: () => void;
  onCopy: (code: string) => void;
}

export function GenerateCodeSection({ isGenerating, newCode, copiedCode, onGenerate, onCopy }: GenerateCodeSectionProps) {
  return (
    <Card className="p-6 bg-card dark:bg-card border border-border/60 mb-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-1">Generar Nuevo Código</h2>
          <p className="text-sm text-muted-foreground">Crea un código de activación para nuevos usuarios</p>
        </div>
        <Button onClick={onGenerate} disabled={isGenerating}
          className="bg-primary hover:bg-primary/90 flex items-center gap-2"
        >
          {isGenerating ? (
            <><RefreshCw className="w-4 h-4 animate-spin" /> Generando...</>
          ) : (
            <><Plus className="w-4 h-4" /> Generar Código</>
          )}
        </Button>
      </div>
      {newCode && (
        <AnimatePresence>
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="mt-4 p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-success dark:text-green-300" />
                <div>
                  <p className="text-sm font-medium text-foreground">Código generado exitosamente</p>
                  <p className="text-lg font-bold text-primary font-mono">{newCode}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => onCopy(newCode)} className="flex items-center gap-2">
                {copiedCode === newCode ? <><CheckCircle2 className="w-4 h-4" /> Copiado</> : <><Copy className="w-4 h-4" /> Copiar</>}
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </Card>
  );
}
