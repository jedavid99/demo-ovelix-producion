import { Button } from '@/shared/components/ui/button';

interface OrdersPaginationProps {
  currentPage: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  totalFiltered: number;
  onPrevPage: () => void;
  onNextPage: () => void;
}

export function OrdersPagination({
  currentPage, totalPages, startIndex, endIndex, totalFiltered,
  onPrevPage, onNextPage,
}: OrdersPaginationProps) {
  if (totalFiltered === 0) return null;

  return (
    <div className="flex items-center justify-between p-4 border-t">
      <p className="text-sm text-muted-foreground">
        Mostrando {startIndex} a {endIndex} de {totalFiltered} órdenes
      </p>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onPrevPage} disabled={currentPage === 1}>
          Anterior
        </Button>
        <Button variant="outline" size="sm" onClick={onNextPage} disabled={currentPage === totalPages}>
          Siguiente
        </Button>
      </div>
    </div>
  );
}
