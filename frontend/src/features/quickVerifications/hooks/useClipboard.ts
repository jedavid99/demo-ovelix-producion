import { useCallback, useEffect, useState } from 'react'

/**
 * Copia texto al portapapeles. Usa la API async de `navigator.clipboard`
 * y cae a una selección manual con `document.execCommand` cuando no está disponible
 * (p. ej. versiones de navegadores o contextos sin permiso).
 */
export function useClipboard(): {
  copied: boolean
  error: string | null
  copy: (text: string) => Promise<void>
} {
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!copied) return
    const t = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(t)
  }, [copied])

  const copy = useCallback(async (text: string) => {
    if (!text) {
      setError('No hay dato para copiar')
      setCopied(false)
      return
    }
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text)
      } else {
        fallbackCopy(text)
      }
      setCopied(true)
      setError(null)
    } catch {
      // Último recurso: selección manual
      try {
        fallbackCopy(text)
        setCopied(true)
        setError(null)
      } catch {
        setError('No se pudo copiar el dato')
        setCopied(false)
      }
    }
  }, [])

  return { copied, error, copy }
}

function fallbackCopy(text: string) {
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'absolute'
  textarea.style.left = '-9999px'
  document.body.appendChild(textarea)
  textarea.select()
  const ok = document.execCommand('copy')
  document.body.removeChild(textarea)
  if (!ok) throw new Error('copy failed')
}

export default useClipboard