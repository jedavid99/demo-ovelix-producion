import { AlertTriangle } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { cn } from '@/shared/lib/utils'

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
  className?: string
}

export function ErrorState({
  title = 'Error al cargar los datos',
  message,
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 py-12 bg-destructive/5 rounded-xl border border-destructive/20 text-center px-4',
        className
      )}
    >
      <AlertTriangle size={40} className="text-destructive" />
      <div>
        <h3 className="text-base font-semibold text-foreground mb-1">{title}</h3>
        {message && <p className="text-sm text-muted-foreground max-w-md mx-auto">{message}</p>}
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Reintentar
        </Button>
      )}
    </div>
  )
}
