import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { exportToCSV } from '@/shared/lib/export';
import type { Product, CategoryData } from '../types';
import { CATEGORIES, ITEMS_PER_PAGE } from '../constants';

export function useStockReport() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setLoading(false);
  }, []);

  const filteredProducts = useMemo(() =>
    products.filter(p => {
      const matchesCategory = selectedCategory === 'Todos' || p.category === selectedCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    }),
    [products, selectedCategory, searchQuery],
  );

  const kpis = useMemo(() => {
    const totalItems = filteredProducts.reduce((sum, p) => sum + p.stock, 0);
    const lowStockItems = filteredProducts.filter(p => p.stock < p.minStock).length;
    const totalInventoryValue = filteredProducts.reduce((sum, p) => sum + p.cost * p.stock, 0);
    const avgStock = filteredProducts.length > 0 ? totalItems / filteredProducts.length : 0;
    const totalSales = filteredProducts.reduce((sum, p) => sum + (p.lastSale ? 1 : 0), 0);
    const inventoryTurnover = avgStock > 0 ? totalSales / avgStock : 0;
    return { totalItems, lowStockItems, totalInventoryValue, inventoryTurnover };
  }, [filteredProducts]);

  const categoryData: CategoryData[] = useMemo(() =>
    CATEGORIES.filter(c => c !== 'Todos').map(cat => {
      const catProducts = filteredProducts.filter(p => p.category === cat);
      const totalStock = catProducts.reduce((sum, p) => sum + p.stock, 0);
      const lowStockCount = catProducts.filter(p => p.stock < p.minStock).length;
      const criticalCount = catProducts.filter(p => p.stock <= p.minStock / 2).length;
      let color = '#10b981';
      if (criticalCount > catProducts.length / 2) color = '#ef4444';
      else if (lowStockCount > catProducts.length / 3) color = '#f59e0b';
      return { name: cat, stock: totalStock, color };
    }),
    [filteredProducts],
  );

  const criticalStockProducts = useMemo(() =>
    filteredProducts.filter(p => p.stock < p.minStock),
    [filteredProducts],
  );

  const noMovementProducts = useMemo(() =>
    filteredProducts.filter(p =>
      !p.lastSale || (Date.now() - p.lastSale.getTime()) > 30 * 24 * 60 * 60 * 1000,
    ),
    [filteredProducts],
  );

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleExport = () => {
    const csvData = filteredProducts.map(p => ({
      Producto: p.name,
      Categoría: p.category,
      'Stock Actual': p.stock,
      'Stock Mínimo': p.minStock,
      'Precio Venta': p.price,
      Costo: p.cost,
      'Valor Total': p.cost * p.stock,
      Estado: p.stock < p.minStock ? 'Crítico' : 'Normal',
    }));
    exportToCSV(csvData, 'reporte-stock');
  };

  const handleRetry = () => {
    setError(false);
    setLoading(true);
    setLoading(false);
  };

  return {
    loading, error, selectedCategory, searchQuery, currentPage,
    products, filteredProducts, kpis, categoryData,
    criticalStockProducts, noMovementProducts,
    paginatedProducts, totalPages,
    setSelectedCategory, setSearchQuery, setCurrentPage,
    handleExport, handleRetry, navigate,
  };
}
