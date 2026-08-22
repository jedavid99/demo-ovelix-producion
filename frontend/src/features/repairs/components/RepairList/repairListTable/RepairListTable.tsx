import { Card, CardContent } from '@/shared/components/ui/card';
import type { Repair } from '../RepairList.types';
import { LoadingState } from '@/shared/components/async/LoadingState';
import { EmptyState } from '@/shared/components/async/EmptyState';
import { ErrorState } from '@/shared/components/async/ErrorState';
import { RepairListTableHeader } from './components/RepairListTableHeader';
import { RepairListTableRow } from './components/RepairListTableRow';
import { RepairListTablePagination } from './components/RepairListTablePagination';

interface RepairListTableProps {
  loading: boolean;
  error?: string | null;
  onRetry?: () => void;
  paginatedRepairs: Repair[];
  currentPage: number;
  totalPages: number;
  totalFiltered: number;
  onPreview: (repairId: string) => void;
  onEdit: (repairId: string) => void;
  onEditStatus: (repairId: string) => void;
  onPDF: (repairId: string) => void;
  onThermalPrint: (repairId: string) => void;
  onMarkDelivered: (repairId: string) => void;
  onDelete: (repairId: string) => void;
  onEvidencias: (repairId: string) => void;
  onPageChange: (page: number) => void;
}

export function RepairListTable({
  loading,
  error,
  onRetry,
  paginatedRepairs,
  currentPage,
  totalPages,
  totalFiltered,
  onPreview,
  onEdit,
  onEditStatus,
  onPDF,
  onThermalPrint,
  onMarkDelivered,
  onDelete,
  onEvidencias,
  onPageChange,
}: RepairListTableProps) {
  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={onRetry} />;
  if (paginatedRepairs.length === 0) return <EmptyState />;

  const actions = { onPreview, onEdit, onEditStatus, onPDF, onThermalPrint, onMarkDelivered, onDelete, onEvidencias };

  return (
    <Card className="border shadow-sm">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-xs">
            <RepairListTableHeader />
            <tbody className="divide-y divide-border/60">
              {paginatedRepairs.map((repair) => (
                <RepairListTableRow key={repair.id} repair={repair} {...actions} />
              ))}
            </tbody>
          </table>
        </div>
        <RepairListTablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalFiltered={totalFiltered}
          pageSize={paginatedRepairs.length}
          onPageChange={onPageChange}
        />
      </CardContent>
    </Card>
  );
}
