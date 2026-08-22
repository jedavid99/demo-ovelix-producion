import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package } from 'lucide-react';
import { StockHeader } from '../../components/stock/StockHeader';
import { StockKPICards } from '../../components/stock/StockKPICards';
import { StockFilters } from '../../components/stock/StockFilters';
import { StockTable } from '../../components/stock/StockTable';
import { StockImportModal } from '../../components/stock/StockImportModal';
import { EmptyState } from '@/shared/components/async/EmptyState';
import { stockService } from '@/services/stockService';
import { exportStockToExcel } from '@/services/stockImportExport';
import type { StockItem } from '@/types/stock.types';

export default function StockPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeStatus, setActiveStatus] = useState('all');
  const [categories, setCategories] = useState<string[]>([]);
  const [importOpen, setImportOpen] = useState(false);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const [stockRes, cats] = await Promise.all([
        stockService.list({ limit: 200 }),
        stockService.getCategories().catch(() => []),
      ]);
      setItems(stockRes?.data || []);
      setCategories(Array.isArray(cats) ? cats : []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const filteredItems = items.filter(item => {
    const matchSearch = !searchTerm ||
      item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.codigo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = activeCategory === 'all' || item.categoria === activeCategory;
    const matchStatus = activeStatus === 'all' || item.estado === activeStatus;
    return matchSearch && matchCategory && matchStatus;
  });

  const handleExport = () => {
    if (filteredItems.length === 0) {
      return;
    }
    exportStockToExcel(filteredItems);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: 'easeOut' }} className="space-y-6">
      <StockHeader
        onNavigateAdd={() => navigate('/stock/add')}
        onExport={handleExport}
        onImport={() => setImportOpen(true)}
      />
      <StockKPICards items={items} loading={loading} />
      <StockFilters
        searchTerm={searchTerm}
        activeCategory={activeCategory}
        activeStatus={activeStatus}
        categories={categories}
        onSearchChange={setSearchTerm}
        onCategoryChange={setActiveCategory}
        onStatusChange={setActiveStatus}
        onClear={() => { setActiveCategory('all'); setActiveStatus('all'); setSearchTerm(''); }}
      />
      {loading ? (
        <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">Cargando inventario...</div>
      ) : filteredItems.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No hay productos"
          description={items.length === 0
            ? 'Tu inventario está vacío. Agrega tu primer producto o importa un archivo Excel.'
            : 'No se encontraron productos con los filtros actuales.'}
          actionLabel={items.length === 0 ? 'Agregar producto' : undefined}
          onAction={items.length === 0 ? () => navigate('/stock/add') : undefined}
        />
      ) : (
        <StockTable items={filteredItems} totalItems={items.length} onRefresh={fetchItems} />
      )}
      <StockImportModal open={importOpen} onClose={() => setImportOpen(false)} onImported={fetchItems} />
    </motion.div>
  );
}
