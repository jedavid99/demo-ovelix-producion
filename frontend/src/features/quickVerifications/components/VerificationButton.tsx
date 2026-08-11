import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { cn } from '@/shared/lib/utils'
import { toast } from '@/shared/components/ui/use-toast'
import { useClipboard } from '../hooks/useClipboard'
import type { VerificationButtonProps } from '../types'

/**
 * Botón que copia `data` al portapapeles (si `copyData`) y abre `url` en una pestaña nueva.
 * - El dato NO se autocompleta en el campo del sitio externo (no se puede por
 *   seguridad cross-origin); por eso se copia al portapapeles para pegarlo ahí.
 * - `window.open` se llama de forma síncrona (sin `await` previo) para que el
 *   navegador no bloquee la pestaña como popup.
 * - Muestra "¡Copiado!" durante 2 segundos tras copiar.
 * - No requiere API: solo navegación + clipboard del navegador.
 */
export function VerificationButton({
  label,
  icon,
  data,
  url,
  copyData = true,
  copyOnly = false,
  variant = 'primary',
  tint,
  className,
  disabled,
  onCopied,
}: VerificationButtonProps) {
  const { copy } = useClipboard()
  const [flash, setFlash] = useState(false)

  const showTint = variant === 'danger' || variant === 'success' || !!tint

  const handleClick = () => {
    if (copyData && !data) {
      toast({
        title: 'Sin dato',
        description: 'Completá el dato antes de verificar.',
        variant: 'destructive',
      })
      return
    }

    // Abrir primero y de forma síncrona: evita el bloqueo de popups del navegador.
    if (url && !copyOnly) {
      window.open(url, '_blank', 'noopener,noreferrer')
    }

    if (copyData) {
      void copy(data)
      toast({ title: 'Dato copiado', description: `${data} → pegá en ${label}` })
      setFlash(true)
      window.setTimeout(() => setFlash(false), 2000)
    }

    onCopied?.(true)
  }

  return (
    <Button
      type="button"
      variant={showTint ? 'default' : 'outline'}
      size="sm"
      disabled={disabled}
      aria-label={`${label}${copyData ? ` (copia ${data})` : ''}`}
      className={cn(
        'gap-1.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm active:translate-y-0',
        showTint ? tint : undefined,
        className
      )}
      onClick={handleClick}
    >
      {icon}
      {flash ? (
        <>
          <Check className="size-4" aria-hidden />
          ¡Copiado!
        </>
      ) : copyData ? (
        <>
          <Copy className="size-3.5 opacity-70" aria-hidden />
          {label}
        </>
      ) : (
        label
      )}
    </Button>
  )
}

export default VerificationButton