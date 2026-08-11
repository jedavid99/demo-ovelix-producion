import { Package, ShoppingCart, ClipboardList, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

interface QuickActionsToolbarProps {
  onSendCatalog?: () => void;
  onRequestQuote?: () => void;
  onSendServiceOrder?: () => void;
  onFileSelectClick: () => void;
}

export const QuickActionsToolbar = ({
  onSendCatalog,
  onRequestQuote,
  onSendServiceOrder,
  onFileSelectClick,
}: QuickActionsToolbarProps) => (
  <div className="px-3 py-2 border-t border-green-200/40 dark:border-green-800/30 bg-card/80 dark:bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-card/60 dark:supports-[backdrop-filter]:bg-background/60">
    <div className="flex items-center gap-2 overflow-x-auto">
      {onSendCatalog && (
        <Button size="sm" variant="ghost" onClick={onSendCatalog}
          className="flex-shrink-0 h-8 px-3 gap-2 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 text-green-700 dark:text-green-400 transition-colors">
          <Package className="h-3.5 w-3.5" />
          <span className="text-xs font-medium">Catálogo</span>
        </Button>
      )}
      {onRequestQuote && (
        <Button size="sm" variant="ghost" onClick={onRequestQuote}
          className="flex-shrink-0 h-8 px-3 gap-2 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 text-orange-700 dark:text-orange-400 transition-colors">
          <ShoppingCart className="h-3.5 w-3.5" />
          <span className="text-xs font-medium">Cotización</span>
        </Button>
      )}
      {onSendServiceOrder && (
        <Button size="sm" variant="ghost" onClick={onSendServiceOrder}
          className="flex-shrink-0 h-8 px-3 gap-2 rounded-lg hover:bg-primary/10 dark:hover:bg-blue-900/30 text-primary dark:text-blue-400 transition-colors">
          <ClipboardList className="h-3.5 w-3.5" />
          <span className="text-xs font-medium">Orden Servicio</span>
        </Button>
      )}
      <Button size="sm" variant="ghost" onClick={onFileSelectClick}
        className="flex-shrink-0 h-8 px-3 gap-2 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 text-purple-700 dark:text-purple-400 transition-colors">
        <ImageIcon className="h-3.5 w-3.5" />
        <span className="text-xs font-medium">Evidencia</span>
      </Button>
    </div>
  </div>
);
