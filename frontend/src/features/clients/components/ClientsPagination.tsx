import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

interface ClientsPaginationProps {
  page: number;
  totalPages: number;
  totalFiltered: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export const ClientsPagination = ({ page, totalPages, totalFiltered, pageSize, onPageChange }: ClientsPaginationProps) => (
  <div className="flex items-center justify-between mt-4">
    <span className="text-sm text-muted-foreground">
      Mostrando {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, totalFiltered)} de {totalFiltered} clientes
    </span>
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={() => onPageChange(Math.max(1, page - 1))} disabled={page === 1} className="gap-1">
        <ChevronLeft size={14} /> Anterior
      </Button>
      <span className="flex items-center px-3 text-sm text-muted-foreground">{page} / {totalPages}</span>
      <Button variant="outline" size="sm" onClick={() => onPageChange(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="gap-1">
        Siguiente <ChevronRight size={14} />
      </Button>
    </div>
  </div>
);
