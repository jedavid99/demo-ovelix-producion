import { Skeleton } from '@/shared/components/ui/skeleton';

export const StockLoadingState = () => (
  <div className="space-y-3">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="flex gap-4 p-4 border border-border rounded-lg">
        <Skeleton variant="rectangular" className="h-10 w-10 rounded" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" className="w-32 h-4" />
          <Skeleton variant="text" className="w-48 h-3" />
        </div>
      </div>
    ))}
  </div>
);
