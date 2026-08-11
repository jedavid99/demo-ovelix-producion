import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { LoadingState } from './LoadingState'
import { EmptyState } from './EmptyState'
import { ErrorState } from './ErrorState'

interface AsyncStateProps {
  loading: boolean
  error?: string | null
  empty?: boolean
  onRetry?: () => void
  loadingLabel?: string
  emptyTitle?: string
  emptyDescription?: string
  emptyIcon?: LucideIcon
  emptyActionLabel?: string
  onEmptyAction?: () => void
  children: ReactNode
}

export function AsyncState({
  loading,
  error,
  empty,
  onRetry,
  loadingLabel,
  emptyTitle,
  emptyDescription,
  emptyIcon,
  emptyActionLabel,
  onEmptyAction,
  children,
}: AsyncStateProps) {
  if (loading) return <LoadingState label={loadingLabel} />
  if (error) return <ErrorState message={error} onRetry={onRetry} />
  if (empty) {
    return (
      <EmptyState
        icon={emptyIcon}
        title={emptyTitle}
        description={emptyDescription}
        actionLabel={emptyActionLabel}
        onAction={onEmptyAction}
      />
    )
  }
  return <>{children}</>
}
