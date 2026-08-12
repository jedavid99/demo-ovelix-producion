'use client'
import React from 'react'
import { Button } from './ui/button'
import { Skeleton } from './ui/skeleton'
import { ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react'

export interface DataTableColumn<T> {
  key: string
  header: string
  render?: (row: T) => React.ReactNode
  align?: 'left' | 'right' | 'center'
  className?: string
}

interface DataTableProps<T> {
  data: T[]
  columns: DataTableColumn<T>[]
  rowKey: (row: T) => string | number
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  loading?: boolean
  error?: string | null
  onRetry?: () => void
  emptyMessage?: string
}

export default function DataTable<T>({
  data,
  columns,
  rowKey,
  currentPage,
  totalPages,
  onPageChange,
  loading = false,
  error,
  onRetry,
  emptyMessage = 'No hay datos disponibles',
}: DataTableProps<T>) {
  const alignClass = (align?: 'left' | 'right' | 'center') =>
    align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left'

  return (
    <div data-tour="table" className="flex flex-col h-full bg-card rounded-lg border border-border shadow-sm dark:shadow-none overflow-hidden transition-all duration-150">
      {/* Table */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full">
          <thead className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider ${alignClass(col.align)}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {columns.map((col) => (
                    <td key={col.key} className={`px-4 py-3 ${alignClass(col.align)}`}>
                      <Skeleton variant="text" className="w-24" />
                    </td>
                  ))}
                </tr>
              ))
            ) : error ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12">
                  <div className="flex flex-col items-center justify-center gap-3 text-center">
                    <AlertTriangle size={32} className="text-destructive" />
                    <p className="text-sm text-muted-foreground">{error}</p>
                    {onRetry && (
                      <Button variant="outline" size="sm" onClick={onRetry}>
                        Reintentar
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-muted-foreground">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={rowKey(row)} className="hover:bg-muted/50 transition-colors duration-150">
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-4 py-3 text-sm ${alignClass(col.align)} ${col.className ?? ''}`}
                    >
                      {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? '')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      {!loading && data.length > 0 && (
        <div className="bg-muted/30 border-t border-border px-4 py-3 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Página <span className="font-semibold text-foreground">{currentPage}</span> de <span className="font-semibold text-foreground">{totalPages}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              variant="outline"
              size="sm"
            >
              <ChevronLeft size={16} />
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }
                return (
                  <Button
                    key={pageNum}
                    onClick={() => onPageChange(pageNum)}
                    variant={currentPage === pageNum ? 'default' : 'ghost'}
                    size="sm"
                  >
                    {pageNum}
                  </Button>
                )
              })}
            </div>
            <Button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              variant="outline"
              size="sm"
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
