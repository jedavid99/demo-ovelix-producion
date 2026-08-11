'use client'
import { Scan } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { QuickVerificationPanel } from './QuickVerificationPanel'

/**
 * Modal de verificaciones rápidas. El estado de apertura lo controla el padre
 * (topbar u otra vista) para abrirlo con un botón.
 */
export function QuickVerificationDialog({
  open = false,
  onOpenChange,
}: {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg" className="bg-card">
        <DialogHeader>
          <DialogTitle>Verificaciones rápidas</DialogTitle>
          <DialogDescription>
            Herramientas oficiales se abren en una pestaña nueva.
          </DialogDescription>
        </DialogHeader>
        <QuickVerificationPanel />
      </DialogContent>
    </Dialog>
  )
}

/** Botón de la barra superior que abre el modal. */
export function QuickVerificationButton({
  onClick,
  title = 'Verificaciones rápidas',
}: {
  onClick?: () => void
  title?: string
}) {
  return (
    <Button variant="ghost" size="icon-sm" onClick={onClick} title={title} aria-label={title}>
      <Scan className="size-[18px] text-muted-foreground" aria-hidden />
    </Button>
  )
}

export default QuickVerificationDialog