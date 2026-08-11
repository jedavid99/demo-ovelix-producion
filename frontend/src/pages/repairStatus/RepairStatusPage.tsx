import { motion } from 'framer-motion';
import { useRepairStatus } from './hooks/useRepairStatus';
import { PageHeader } from './components/PageHeader';
import { SearchSection } from './components/SearchSection';
import { StatusCard } from './components/StatusCard';
import { RepairDetails } from './components/RepairDetails';

export default function RepairStatus() {
  const { orderNumber, setOrderNumber, isLoading, repairData, error, handleSearch } = useRepairStatus();

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#f9f9ff] to-[#eef2ff]">
      <PageHeader />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <SearchSection
          orderNumber={orderNumber}
          isLoading={isLoading}
          error={error}
          onOrderNumberChange={setOrderNumber}
          onSearch={handleSearch}
        />

        {repairData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <StatusCard repairData={repairData} />
            <RepairDetails repairData={repairData} />
          </motion.div>
        )}
      </div>
    </main>
  );
}
