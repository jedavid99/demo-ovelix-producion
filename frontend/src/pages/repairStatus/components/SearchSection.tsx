import { motion } from 'framer-motion';
import { Search, AlertCircle } from 'lucide-react';

interface SearchSectionProps {
  orderNumber: string;
  isLoading: boolean;
  error: string;
  onOrderNumberChange: (value: string) => void;
  onSearch: (e: React.FormEvent) => void;
}

export function SearchSection({ orderNumber, isLoading, error, onOrderNumberChange, onSearch }: SearchSectionProps) {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-[#c2c6d6]/60 p-8 mb-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#191b23] mb-2">
          Consultar Estado de Reparaci\u00F3n
        </h1>
        <p className="text-[#424754]">
          Ingrese el n\u00FAmero de su orden de servicio para ver el estado actual
        </p>
      </div>

      <form onSubmit={onSearch} className="max-w-xl mx-auto">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#727785]">
            <Search className="w-5 h-5" />
          </span>
          <input
            className="w-full pl-12 pr-4 py-4 bg-white border border-[#c2c6d6] rounded-xl text-lg placeholder-[#727785] focus:outline-none focus:ring-2 focus:ring-[#0058be]/20 focus:border-[#0058be] transition-all"
            type="text"
            placeholder="Ej: REP-20240121-0001"
            value={orderNumber}
            onChange={(e) => onOrderNumberChange(e.target.value.toUpperCase())}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-[#0058be] text-white hover:bg-[#2170e4] active:scale-[0.98] font-medium text-sm rounded-lg shadow-md cursor-pointer transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Buscando...' : 'Buscar'}
          </button>
        </div>
      </form>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </motion.div>
      )}
    </div>
  );
}
