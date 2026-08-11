import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X, User, Wrench, Package, Receipt, DollarSign, BarChart3, Truck, FileText, ArrowRight } from 'lucide-react'
import { Dialog, DialogContent } from './ui/dialog'
import { ErrorState } from './async/ErrorState'
import { clientService } from '@/services/clientService'
import { repairService } from '@/services/repairService'
import { Client } from '@/types/client.types'
import { Repair } from '@/types/repair.types'

interface SearchResult {
  id: string
  type: 'client' | 'repair' | 'sale' | 'product' | 'expense'
  category: string
  title: string
  description: string
  icon: React.ReactNode
  route: string
  highlight?: string[]
}

export const SearchModal = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searchError, setSearchError] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (open) {
      searchInputRef.current?.focus()
      setQuery('')
      setResults([])
      setSelectedIndex(0)
    }
  }, [open])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return

      if (e.key === 'Escape') {
        onOpenChange(false)
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0))
      } else if (e.key === 'Enter' && results.length > 0) {
        e.preventDefault()
        navigate(results[selectedIndex].route)
        onOpenChange(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, results, selectedIndex, navigate, onOpenChange])

  const searchClients = async (q: string): Promise<SearchResult[]> => {
    try {
      const response = await clientService.list({ limit: 100 })
      const clients = response?.data?.data?.data || response?.data?.data?.clientes || response?.data?.data || []
      
      const searchTerms = q.toLowerCase().split(' ').filter(Boolean)
      
      const filteredClients = clients.filter((client: Client) => {
        const nombreMatch = client.nombre_completo?.toLowerCase().includes(q.toLowerCase())
        const dniMatch = client.dni?.toLowerCase().includes(q.toLowerCase())
        
        // Búsqueda por términos individuales
        const termsMatch = searchTerms.every(term => 
          client.nombre_completo?.toLowerCase().includes(term) ||
          client.dni?.toLowerCase().includes(term)
        )
        
        return nombreMatch || dniMatch || termsMatch
      }).slice(0, 5)
      
      return filteredClients.map((client: Client) => ({
        id: client.id,
        type: 'client',
        category: 'Clientes',
        title: client.nombre_completo,
        description: `DNI: ${client.dni || 'N/A'} • Tel: ${client.telefono}`,
        icon: <User size={16} className="text-blue-600 dark:text-blue-400" />,
        route: `/clients`,
        highlight: searchTerms
      }))
    } catch (error) {
      console.error('Error searching clients:', error)
      setSearchError(true)
      return []
    }
  }

  const searchRepairs = async (q: string): Promise<SearchResult[]> => {
    try {
      const response = await repairService.list({ search: q, limit: 5 })
      const repairs = response?.data?.data?.data || response?.data?.data?.repairs || response?.data?.data || []
      
      return repairs.map((repair: Repair) => ({
        id: repair.id,
        type: 'repair',
        category: 'Reparaciones',
        title: `${repair.dispositivo} - ${repair.marca || ''} ${repair.modelo || ''}`.trim(),
        description: `Cliente: ${repair.cliente_nombre || 'N/A'} • ${repair.problema_reportado?.substring(0, 50) || ''}...`,
        icon: <Wrench size={16} className="text-orange-600 dark:text-orange-400" />,
        route: `/reparaciones/list`,
        highlight: q.split(' ').filter(Boolean)
      }))
    } catch (error) {
      console.error('Error searching repairs:', error)
      setSearchError(true)
      return []
    }
  }

  const performSearch = async (q: string) => {
    if (!q.trim()) {
      setResults([])
      setSearchError(false)
      return
    }

    setLoading(true)
    setSearchError(false)
    try {
      const [clientResults, repairResults] = await Promise.all([
        searchClients(q),
        searchRepairs(q)
      ])

      const allResults = [...clientResults, ...repairResults]
      setResults(allResults)
      setSelectedIndex(0)
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
      setSearchError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (query.trim()) {
        performSearch(query)
      } else {
        setResults([])
      }
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [query])

  const highlightText = (text: string, highlights: string[] = []) => {
    if (!highlights.length) return text

    const regex = new RegExp(`(${highlights.join('|')})`, 'gi')
    const parts = text.split(regex)

    return parts.map((part, i) => {
      if (highlights.some(h => part.toLowerCase() === h.toLowerCase())) {
        return <mark key={i} className="bg-blue-200 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 rounded px-0.5">{part}</mark>
      }
      return <span key={i}>{part}</span>
    })
  }

  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.category]) {
      acc[result.category] = []
    }
    acc[result.category].push(result)
    return acc
  }, {} as Record<string, SearchResult[]>)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 shadow-xl">
        {/* Cabecera del buscador */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Buscar clientes, reparaciones..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-12 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 focus:border-blue-500 dark:focus:border-blue-400"
            />
            <button
              onClick={() => onOpenChange(false)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
            >
              <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">
                ESC
              </kbd>
             
            </button>
          </div>
        </div>

        {/* Cuerpo con resultados */}
        <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
          {loading && (
            <div className="flex items-center justify-center py-12 text-gray-500 dark:text-gray-400">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 dark:border-gray-600 border-t-blue-600 dark:border-t-blue-400" />
            </div>
          )}

          {!loading && !query && (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <Search size={48} className="mx-auto mb-4 opacity-40" />
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300">Busca en ovelix</p>
              <p className="text-sm mt-1 text-gray-400 dark:text-gray-500">Clientes, reparaciones y más</p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                <kbd className="px-2 py-1 text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">
                  ⌘K
                </kbd>
                <span className="text-gray-400 dark:text-gray-500">para abrir</span>
              </div>
            </div>
          )}

          {!loading && query && results.length === 0 && !searchError && (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <Search size={48} className="mx-auto mb-4 opacity-40" />
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300">No se encontraron resultados</p>
              <p className="text-sm mt-1 text-gray-400 dark:text-gray-500">Intenta con otros términos</p>
            </div>
          )}

          {!loading && query && searchError && (
            <div className="p-6">
              <ErrorState
                title="No se pudo completar la búsqueda"
                message="Ocurrió un error al buscar. Verifica tu conexión e intenta nuevamente."
                onRetry={() => performSearch(query)}
              />
            </div>
          )}

          {!loading && query && results.length > 0 && (
            <div className="p-2">
              {Object.entries(groupedResults).map(([category, categoryResults]) => (
                <div key={category} className="mb-4">
                  <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {category}
                  </div>
                  {categoryResults.map((result, idx) => {
                    const globalIndex = results.findIndex(r => r.id === result.id)
                    const isSelected = globalIndex === selectedIndex
                    return (
                      <button
                        key={result.id}
                        onClick={() => {
                          navigate(result.route)
                          onOpenChange(false)
                        }}
                        className={`w-full flex items-start gap-3 px-3 py-3 rounded-lg transition-colors ${
                          isSelected ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200'
                        }`}
                      >
                        <div className="mt-0.5">{result.icon}</div>
                        <div className="flex-1 text-left">
                          <div className="font-medium text-sm">
                            {highlightText(result.title, result.highlight)}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {highlightText(result.description, result.highlight)}
                          </div>
                        </div>
                        <ArrowRight size={14} className="text-gray-400 dark:text-gray-500 mt-1" />
                      </button>
                    )
                  })}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pie con atajos de teclado */}
        {results.length > 0 && (
          <div className="p-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>
              {results.length} resultado{results.length !== 1 ? 's' : ''}
            </span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">↑↓</kbd>
                navegar
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">↵</kbd>
                seleccionar
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">esc</kbd>
                cerrar
              </span>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}