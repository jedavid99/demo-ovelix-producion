import { AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useRepairQR } from '../../../hooks/repairQR/useRepairQR';
import { STATUS_MAP, PRIORITY_MAP } from '../../../constants/repairQR/repairQR.constants';
import { LoadingState } from '@/shared/components/async/LoadingState';
import { ErrorState } from '@/shared/components/async/ErrorState';
import { HeaderBar } from './components/HeaderBar';
import { DeviceCard } from './components/DeviceCard';
import { ClientCard } from './components/ClientCard';
import { SecurityCard } from './components/SecurityCard';
import { PartsCard } from './components/PartsCard';
import { AccessoriesCard } from './components/AccessoriesCard';
import { PaymentCard } from './components/PaymentCard';
import { PhotosCard } from './components/PhotosCard';
import { NotesCard } from './components/NotesCard';
import { ActionButtons } from './components/ActionButtons';

export default function RepairQRDetailsPage() {
  const navigate = useNavigate();
  const qr = useRepairQR();

  if (qr.loading) return <LoadingState />;
  if (qr.error || !qr.repair) return <ErrorState message={qr.error || undefined} onRetry={() => navigate('/reparaciones/qr-scanner')} />;

  const repair = qr.repair;
  const statusInfo = STATUS_MAP[repair.estado?.toLowerCase()] || { label: repair.estado || 'Desconocido', color: '#6B7280', icon: <AlertCircle className="w-4 h-4" /> };
  const priorityInfo = repair.prioridad ? PRIORITY_MAP[repair.prioridad.toLowerCase()] : null;
  const clientDni = qr.getClientDni(repair);
  const technicianName = qr.getTechnicianName(repair);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/60 p-4 md:p-6">
      <HeaderBar numeroReparacion={repair.numero_reparacion} statusInfo={statusInfo} priorityInfo={priorityInfo} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DeviceCard repair={repair} formatDate={qr.formatDate} formatCurrency={qr.formatCurrency} />
        <ClientCard repair={repair} clientDni={clientDni} technicianName={technicianName} />
        <SecurityCard repair={repair} />
        <PartsCard repair={repair} formatCurrency={qr.formatCurrency} />
      </div>

      <AccessoriesCard repair={repair} />
      <PaymentCard repair={repair} />
      <PhotosCard repair={repair} />
      <NotesCard repair={repair} />
      <ActionButtons repairId={repair.id} />
    </div>
  );
}
