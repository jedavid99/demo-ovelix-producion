import { motion } from 'framer-motion';
import { useCashRegister } from './hooks/useCashRegister';
import { useClosingTimeNotification } from './hooks/useClosingTimeNotification';
import { CashRegisterHeader } from './components/CashRegisterHeader';
import { ExpectedBalanceCard } from './components/ExpectedBalanceCard';
import { PhysicalCountForm } from './components/PhysicalCountForm';
import { DiscrepancySummary } from './components/DiscrepancySummary';

export default function CajaDiaria() {
  const {
    cash, transactions, actualTotal, discrepancy, hasDiscrepancy,
    summary, loadingSummary,
    handleChange, handleSaveProgress, handleFinalize,
  } = useCashRegister();

  useClosingTimeNotification();

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
      <CashRegisterHeader />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-6">
          <ExpectedBalanceCard
            transactions={transactions}
            totalEfectivo={summary?.total_efectivo ?? 0}
            totalTarjeta={summary?.total_tarjeta ?? 0}
            totalTransferencia={summary?.total_transferencia ?? 0}
            totalVentas={summary?.total_ventas ?? 0}
            loading={loadingSummary}
          />
        </div>
        <div className="lg:col-span-7">
          <PhysicalCountForm cash={cash} actualTotal={actualTotal} onChange={handleChange} />
        </div>
      </div>
      <DiscrepancySummary
        discrepancy={discrepancy} hasDiscrepancy={hasDiscrepancy}
        onSaveProgress={handleSaveProgress} onFinalize={handleFinalize}
      />
    </motion.div>
  );
}
