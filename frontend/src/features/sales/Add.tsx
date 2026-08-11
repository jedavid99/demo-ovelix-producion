import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Filter, Plus, Minus, CreditCard, DollarSign, ShoppingCart, ChevronRight } from 'lucide-react'
import { toast } from '@/shared/components/ui/use-toast'
type CatalogItem = {
  id: string
  title: string
  price: number
  stock?: number
  img?: string
  badge?: string
}
// 📦 CATÁLOGO VACÍO – reemplazar con llamada a la API
const CATALOG: CatalogItem[] = []
export default function SaleAdd() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState('') // vacío
  const [items, setItems] = useState<{ item: CatalogItem; qty: number }[]>([]) // carrito vacío
  // Filtrado (con catálogo vacío no muestra nada)
  const filtered = useMemo(
    () => CATALOG.filter(c => c.title.toLowerCase().includes(query.toLowerCase())),
    [query]
  )
  const addItem = (it: CatalogItem) => {
    setItems(prev => {
      const existing = prev.find(p => p.item.id === it.id)
      if (existing) {
        return prev.map(p =>
          p.item.id === it.id
            ? { ...p, qty: Math.min((p.qty || 0) + 1, it.stock || 9999) }
            : p
        )
      }
      return [{ item: it, qty: 1 }, ...prev]
    })
  }
  const changeQty = (id: string, delta: number) => {
    setItems(prev =>
      prev.map(p =>
        p.item.id === id
          ? {
              ...p,
              qty: Math.max(1, Math.min((p.qty || 1) + delta, p.item.stock || 9999)),
            }
          : p
      )
    )
  }
  const removeItem = (id: string) =>
    setItems(prev => prev.filter(p => p.item.id !== id))
  const subtotal = items.reduce((s, p) => s + p.item.price * p.qty, 0)
  const taxRate = 0.08
  const tax = +(subtotal * taxRate).toFixed(2)
  const total = +(subtotal + tax).toFixed(2)
  return (
    <div className="h-full flex flex-col gap-4">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">Crear Venta</h1>
        
      </div>
      <div className="flex-1 flex gap-4 min-h-0">
        {/* Catálogo */}
        <section className="flex-1 min-w-0 bg-card  rounded-xl border border-border  overflow-hidden shadow-sm flex flex-col">
          <div className="p-4 border-b border-border  flex items-center justify-between">
            <h2 className="text-lg font-bold">Catálogo</h2>
            <div className="flex gap-2">
              <button onClick={() => toast({ title: 'Item Personalizado', description: 'Función disponible próximamente.' })} className="px-3 py-2 rounded-lg bg-primary text-white text-xs font-bold flex items-center gap-2">
                <Plus size={14} /> Item Personalizado
              </button>
            </div>
          </div>
          {/* Buscador */}
          <div className="p-4 flex gap-4 border-b border-border  bg-muted/50 dark:bg-muted/20">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-lg text-sm focus:ring-primary focus:border-primary"
                placeholder="Buscar por nombre, categoría o SKU..."
                aria-label="Buscar por nombre, categoría o SKU"
              />
            </div>
            <button aria-label="Filtrar productos" onClick={() => toast({ title: 'Filtros', description: 'No hay productos en el catálogo para filtrar.' })} className="flex items-center justify-center rounded-lg h-10 w-10 bg-background border border-input text-muted-foreground">
              <Filter size={16} />
            </button>
          </div>
         
          {/* Grid de productos */}
          <div className="flex-1 overflow-y-auto p-4">
            {filtered.length === 0 ? (
              <div className="text-center text-muted-foreground py-12">
                <ShoppingCart className="mx-auto mb-4 opacity-20" size={48} />
                <p className="font-medium">No hay productos disponibles</p>
                <p className="text-sm">Agrega items desde el panel de administración</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map(it => (
                  <button
                    key={it.id}
                    onClick={() => addItem(it)}
                    className="group flex flex-col text-left p-3 bg-background border border-input rounded-xl hover:border-primary hover:shadow-md transition-all"
                  >
                    <div className="aspect-square w-full rounded-lg bg-muted  mb-3 flex items-center justify-center overflow-hidden">
                      <ShoppingCart size={36} className="text-muted-foreground" />
                    </div>
                    <p className="font-bold text-sm mb-1 truncate">{it.title}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-primary font-bold">${it.price.toFixed(2)}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-muted  text-muted-foreground font-bold uppercase tracking-tight">
                        {it.badge ?? (it.stock ? `${it.stock} en stock` : 'Servicio')}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
        {/* Venta Actual */}
         <section className="w-[420px] shrink-0 flex flex-col bg-card  rounded-xl border border-border  overflow-hidden shadow-sm h-full max-h-[calc(100vh-120px)]">
  {/* Cabecera: cliente y número de venta - fijo */}
  {/* <div className="p-4 border-b border-border  flex flex-col gap-3 flex-shrink-0">
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-bold">Venta Actual</h2>
      <span className="text-muted-foreground text-sm">#Nuevo</span>
    </div>
    <div className="relative">
      <div className="flex items-center gap-3 p-3 bg-muted dark:bg-muted rounded-lg border border-border dark:border-border">
        <Search className="text-muted-foreground" />
        <div className="flex-1">
          <p className="text-xs text-muted-foreground font-bold uppercase tracking-wide">Cliente</p>
          <p className="text-sm font-bold">
            {selectedCustomer || 'Seleccionar cliente'}
          </p>
        </div>
        <button
          onClick={() => setSelectedCustomer('Cliente en Caja')}
          className="text-primary text-xs font-bold px-2 py-1 rounded bg-primary/10"
        >
          Cambiar
        </button>
      </div>
    </div>
  </div> */}
  {/* Lista de items del carrito (scroll) - con altura limitada */}
  <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[100px] max-h-[280px]">
    {items.length === 0 ? (
      <div className="text-center text-muted-foreground py-12">
        <ShoppingCart className="mx-auto mb-4 opacity-20" size={48} />
        <p className="font-medium">Carrito vacío</p>
        <p className="text-sm">Selecciona productos del catálogo</p>
      </div>
    ) : (
      items.map(p => (
        <div key={p.item.id} className="flex items-start gap-3">
          <div className="size-12 rounded-lg bg-muted dark:bg-muted flex items-center justify-center shrink-0">
            <ShoppingCart className="text-muted-foreground" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between mb-0.5">
              <p className="text-sm font-bold">{p.item.title}</p>
              <p className="text-sm font-bold">${(p.item.price).toFixed(2)}</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => changeQty(p.item.id, -1)}
                  aria-label={`Disminuir cantidad de ${p.item.title}`}
                  className="size-6 rounded border border-border dark:border-border flex items-center justify-center hover:bg-muted dark:hover:bg-muted"
                >
                  <Minus size={14} />
                </button>
                <span className="text-sm font-bold">{p.qty}</span>
                <button
                  onClick={() => changeQty(p.item.id, 1)}
                  aria-label={`Aumentar cantidad de ${p.item.title}`}
                  className="size-6 rounded border border-border dark:border-border flex items-center justify-center hover:bg-muted dark:hover:bg-muted"
                >
                  <Plus size={14} />
                </button>
              </div>
              <button
                onClick={() => removeItem(p.item.id)}
                className="text-destructive text-xs font-bold hover:underline"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      ))
    )}
  </div>
  {/* Totales y botón - fijo abajo */}
  <div className="p-6 bg-muted dark:bg-muted border-t border-border dark:border-border space-y-4 flex-shrink-0">
    <div className="flex items-center justify-between text-sm text-muted-foreground font-medium">
      <span>Subtotal</span>
      <span>${subtotal.toFixed(2)}</span>
    </div>
    <div className="flex items-center justify-between text-sm text-muted-foreground font-medium">
      <div className="flex items-center gap-1">
        <span>Impuesto</span>
        <span className="text-[10px] bg-muted  px-1 rounded">8%</span>
      </div>
      <span>${tax.toFixed(2)}</span>
    </div>
    <div className="flex items-center justify-between text-sm text-muted-foreground font-medium pb-2 border-b border-dashed border-border dark:border-border">
    
    </div>
    <div className="flex items-center justify-between text-xl font-extrabold text-foreground py-2">
      <span>Total</span>
      <span className="text-primary">${total.toFixed(2)}</span>
    </div>
    {/* Botón principal */}
    <button
      onClick={() => navigate('/sales')}
      className="w-full mt-4 py-5 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary/90 shadow-xl shadow-primary/30 transition-all flex items-center justify-center gap-2"
    >
      Completar Transacción
      <ChevronRight size={20} />
    </button>
  </div>
</section>
      </div>
    </div>
  )
}
