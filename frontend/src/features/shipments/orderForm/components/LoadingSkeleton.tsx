import { Card } from '@/shared/components/ui/card';

export function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <Card className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="h-4 bg-muted rounded w-1/2" />
          <div className="space-y-2 mt-6">
            <div className="h-10 bg-muted rounded" />
            <div className="h-10 bg-muted rounded" />
            <div className="h-10 bg-muted rounded" />
          </div>
        </div>
      </Card>
    </div>
  );
}
