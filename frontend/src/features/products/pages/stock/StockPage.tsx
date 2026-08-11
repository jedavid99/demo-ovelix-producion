import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { StockHeader } from '../../components/stock/StockHeader';
import { StockKPICards } from '../../components/stock/StockKPICards';
import { StockFilters } from '../../components/stock/StockFilters';
import { StockTable } from '../../components/stock/StockTable';
import { StockLoadingState } from '../../components/stock/StockLoadingState';
import { EmptyState } from '@/shared/components/async/EmptyState';
import { Package } from 'lucide-react';
import { stockItems } from '../../constants/stock/stock.constants';

export default function StockPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeStatus, setActiveStatus] = useState('all');
  const [loading, setLoading] = useState(false);

  const filteredItems = useMemo(() => {
    return stockItems.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === 'all' || item.category.toLowerCase() === activeCategory;
      const matchesStatus = activeStatus === 'all' ||
        (activeStatus === 'good' && item.status === 'Good') ||
        (activeStatus === 'low' && item.status === 'Low') ||
        (activeStatus === 'out' && item.status === 'Out');
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [searchTerm, activeCategory, activeStatus]);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: 'easeOut' }} className="space-y-8">
      <StockHeader onNavigateAdd={() => navigate('/stock/add')} />
      <StockKPICards />
      <StockFilters
        searchTerm={searchTerm} activeCategory={activeCategory} activeStatus={activeStatus}
        onSearchChange={setSearchTerm} onCategoryChange={setActiveCategory} onStatusChange={setActiveStatus}
        onClear={() => { setActiveCategory('all'); setActiveStatus('all'); setSearchTerm(''); }}
      />
      {loading ? <StockLoadingState /> : filteredItems.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No hay productos"
          description="No se encontraron productos con los filtros actuales. Prueba a ajustar tu búsqueda o agrega un nuevo producto."
          actionLabel="Agregar producto"
          onAction={() => navigate('/stock/add')}
        />
      ) : <StockTable items={filteredItems} totalItems={stockItems.length} />}
    </motion.div>
  );
}
