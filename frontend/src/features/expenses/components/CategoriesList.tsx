import React from 'react'
import { Tag } from 'lucide-react'
import { EmptyState } from '@/shared/components/async/EmptyState'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { formatCurrency } from '@/utils/currency'
import type { Category } from '../types/categories.types'

interface CategoriesListProps {
  filteredCategories: Category[]
  paginatedCategories: Category[]
  currentPage: number
  totalPages: number
  onPageChange: React.Dispatch<React.SetStateAction<number>>
}

const CategoriesList: React.FC<CategoriesListProps> = ({
  filteredCategories, paginatedCategories, currentPage, totalPages, onPageChange,
}) => {
  if (filteredCategories.length === 0) {
    return (
      <EmptyState
        icon={Tag}
        title="No hay categorías registradas"
        description="Registra gastos con una categoría para ver el desglose aquí."
      />
    )
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-card/80 backdrop-blur-sm">
              <tr className="border-b border-border text-left text-sm text-muted-foreground">
                <th className="px-6 py-4 font-medium">Nombre</th>
                <th className="px-6 py-4 font-medium text-right">Total Gasto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedCategories.map((category) => (
                <tr key={category.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center">
                        <Tag size={16} className="text-muted-foreground" />
                      </div>
                      <span className="font-medium text-foreground capitalize">{category.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-medium">
                    {category.totalAmount > 0 ? formatCurrency(category.totalAmount) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Mostrando {(currentPage - 1) * 10 + 1} - {Math.min(currentPage * 10, filteredCategories.length)} de {filteredCategories.length}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => onPageChange((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
                Anterior
              </Button>
              <Button variant="outline" size="sm" onClick={() => onPageChange((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                Siguiente
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default CategoriesList