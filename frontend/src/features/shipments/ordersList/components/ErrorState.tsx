import { motion } from 'framer-motion';
import { MdErrorOutline } from 'react-icons/md';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';

interface ErrorStateProps {
  onRetry: () => void;
}

export function ErrorState({ onRetry }: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <Card className="p-12 text-center">
        <MdErrorOutline className="w-16 h-16 mx-auto text-destructive mb-4" />
        <h3 className="text-lg font-semibold mb-2">Error al cargar las órdenes</h3>
        <p className="text-muted-foreground mb-4">Hubo un problema al obtener los datos</p>
        <Button onClick={onRetry}>Reintentar</Button>
      </Card>
    </motion.div>
  );
}
