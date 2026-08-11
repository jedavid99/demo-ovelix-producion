import { useNavigate } from 'react-router-dom';
import { useInsurance } from './hooks/useInsurance';
import { InsuranceHeader } from './components/InsuranceHeader';
import { InsuranceFilters } from './components/InsuranceFilters';
import { DevicesTable } from './components/DevicesTable';
import { DeviceDrawer } from './components/DeviceDrawer';

export default function IPhoneInsurance() {
  const navigate = useNavigate();
  const {
    devices, selectedDevice, modelFilter, insuranceFilter, expirationFilter, currentPage,
    setSelectedDevice, setModelFilter, setInsuranceFilter, setExpirationFilter, setCurrentPage,
    getStatusBadge,
  } = useInsurance();

  return (
    <div className="space-y-6">
      <InsuranceHeader onAddInsurance={() => navigate('/stock/iphone-insurance')} />
      <InsuranceFilters
        modelFilter={modelFilter} insuranceFilter={insuranceFilter} expirationFilter={expirationFilter}
        onModelFilterChange={setModelFilter} onInsuranceFilterChange={setInsuranceFilter}
        onExpirationFilterChange={setExpirationFilter}
        onClearFilters={() => { setModelFilter('All Series'); setInsuranceFilter('Active Status'); setExpirationFilter('Expiring Soon'); }}
      />
      <DevicesTable
        devices={devices} currentPage={currentPage} onPageChange={setCurrentPage}
        onSelectDevice={setSelectedDevice} getStatusBadge={getStatusBadge}
      />
      {selectedDevice && (
        <DeviceDrawer device={selectedDevice} onClose={() => setSelectedDevice(null)} />
      )}
    </div>
  );
}
