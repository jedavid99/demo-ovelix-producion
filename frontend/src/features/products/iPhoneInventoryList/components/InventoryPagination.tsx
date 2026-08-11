import { ChevronLeft, ChevronRight } from 'lucide-react';

interface InventoryPaginationProps {
  currentPage: number;
  totalPages: number;
  total: number;
  onPageChange?: (page: number) => void;
}

export function InventoryPagination({ currentPage, totalPages, total, onPageChange }: InventoryPaginationProps) {
  const hasNext = currentPage < totalPages;
  const hasPrev = currentPage > 1;

  return (
    <div className="p-4 border-t border-border  flex items-center justify-between">
      <p className="text-xs text-muted-foreground font-medium">
        Mostrando {total} {total === 1 ? 'entrada' : 'entradas'}
      </p>
      <div className="flex items-center gap-1">
        <button
          className="w-8 h-8 flex items-center justify-center rounded border border-border  hover:bg-muted dark:hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!hasPrev}
          onClick={() => onPageChange?.(currentPage - 1)}
          aria-label="Página anterior"
        >
          <ChevronLeft size={16} />
        </button>
        <button className="w-8 h-8 flex items-center justify-center rounded bg-primary text-white text-xs font-bold">{currentPage}</button>
        <button
          className="w-8 h-8 flex items-center justify-center rounded border border-border  hover:bg-muted dark:hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!hasNext}
          onClick={() => onPageChange?.(currentPage + 1)}
          aria-label="Página siguiente"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
