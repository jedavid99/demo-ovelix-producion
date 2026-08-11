import { FlaskConical } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

interface DemoNoticeProps {
  title?: string
  description?: string
  className?: string
}

export function DemoNotice({
  title = 'Modo demo',
  description = 'Esta sección aún no está conectada al backend. Los datos mostrados son de ejemplo.',
  className,
}: DemoNoticeProps) {
  return (
    <div
      className={cn(
        'flex items-start gap-2.5 rounded-lg border border-dashed border-amber-500/50 bg-amber-500/5 px-3 py-2.5 text-xs',
        className
      )}
    >
      <FlaskConical size={16} className="text-amber-600 shrink-0 mt-0.5" />
      <div>
        <p className="font-semibold text-amber-700">{title}</p>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}
