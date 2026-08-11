import { Smartphone, Cpu, UserCheck, Gamepad2, ExternalLink } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from '@/shared/components/ui/button'
import { cn } from '@/shared/lib/utils'
import {
  QUICK_VERIFICATION_CATEGORIES,
  CATEGORY_TINT_STYLE,
  CATEGORY_ICON,
} from '../constants'
import type { QuickVerificationPanelProps, VerificationCategory } from '../types'

const ICON_MAP: Record<string, typeof Smartphone> = {
  smartphone: Smartphone,
  cpu: Cpu,
  user: UserCheck,
  gamepad: Gamepad2,
}

/**
 * Panel de verificaciones rápidas: botones que abren cada herramienta oficial
 * en una pestaña nueva, agrupados por categoría. Sin campos de entrada:
 * un clic te lleva directo a la página de verificación.
 */
export function QuickVerificationPanel({
  categories = QUICK_VERIFICATION_CATEGORIES,
  disabled,
  className,
}: QuickVerificationPanelProps) {
  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <div className="grid grid-cols-1 gap-2 xl:grid-cols-2">
        <AnimatePresence initial={false} mode="popLayout">
          {categories.map((cat) => (
            <motion.div
              key={cat.id}
              layout
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              <CategoryCard category={cat} disabled={disabled} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <p className="text-xs text-muted-foreground">
        Cada botón abre la web oficial en una pestaña nueva. Los sitios no autocompletan el
        dato por seguridad: pegalo (Ctrl+V) en el campo de la página.
      </p>
    </div>
  )
}

function CategoryCard({
  category: cat,
  disabled,
}: {
  category: VerificationCategory
  disabled?: boolean
}) {
  const style =
    CATEGORY_TINT_STYLE[cat.tint] ?? {
      chip: 'bg-muted text-muted-foreground ring-border',
    }
  const IconComp = ICON_MAP[CATEGORY_ICON[cat.id]] ?? Smartphone

  return (
    <div className="group rounded-xl border border-border bg-card p-3.5 transition-colors duration-200 hover:bg-muted/40">
      <div className="mb-2.5 flex items-center gap-2.5">
        <span
          aria-hidden
          className={cn(
            'flex size-8 shrink-0 items-center justify-center rounded-lg ring-1',
            style.chip
          )}
        >
          <IconComp className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold leading-tight text-foreground">
            {cat.title}
          </h3>
          <p className="truncate text-xs text-muted-foreground">{cat.hint}</p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {cat.actions.map((action) => (
          <Button
            key={action.id}
            type="button"
            variant={action.variant === 'outline' ? 'outline' : 'default'}
            size="sm"
            disabled={disabled}
            aria-label={`Abrir ${action.label}`}
            className={cn(
              'justify-between gap-2 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0',
              action.tint
            )}
            onClick={() => window.open(action.url, '_blank', 'noopener,noreferrer')}
          >
            <span>{action.label}</span>
            <ExternalLink className="size-3.5 opacity-80" aria-hidden />
          </Button>
        ))}
      </div>
    </div>
  )
}

export default QuickVerificationPanel