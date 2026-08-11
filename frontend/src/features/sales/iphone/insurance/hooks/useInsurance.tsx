import { useState } from 'react';
import { Badge } from '@/shared/components/ui/badge';
import type { Device } from '../types';

export function useInsurance() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [modelFilter, setModelFilter] = useState('All Series');
  const [insuranceFilter, setInsuranceFilter] = useState('Active Status');
  const [expirationFilter, setExpirationFilter] = useState('Expiring Soon');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [insuranceStep, setInsuranceStep] = useState(0);
  const [searchEmail, setSearchEmail] = useState('');
  const [foundClient, setFoundClient] = useState<Device | null>(null);
  const [clientNotFound, setClientNotFound] = useState(false);
  const [showRegisterClient, setShowRegisterClient] = useState(false);
  const [newClient, setNewClient] = useState({ name: '', email: '', phone: '' });
  const [newInsurance, setNewInsurance] = useState({
    deviceId: '', planType: '', coverage: '', premium: 0,
    startDate: new Date().toISOString().split('T')[0], expiryDate: '',
  });

  const devices: Device[] = [];

  const handleSearchClient = () => {
    const foundDevices = devices.filter(d => d.email.toLowerCase() === searchEmail.toLowerCase());
    if (foundDevices.length > 0) {
      setFoundClient(foundDevices[0]);
      setClientNotFound(false);
      setShowRegisterClient(false);
      setInsuranceStep(1);
    } else {
      setFoundClient(null);
      setClientNotFound(true);
      setShowRegisterClient(false);
    }
  };

  const handleRegisterNewClient = () => {
    const newDevice: Device = {
      id: String(devices.length + 1),
      saleId: `#SL-${Math.floor(Math.random() * 10000)}`,
      customer: newClient.name,
      email: newClient.email,
      model: '', imei: '',
      saleDate: new Date().toLocaleDateString(),
      status: 'none',
    };
    setFoundClient(newDevice);
    setClientNotFound(false);
    setShowRegisterClient(false);
    setInsuranceStep(1);
    setNewClient({ name: '', email: '', phone: '' });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge variant="success">Activo</Badge>;
      case 'expired': return <Badge variant="destructive">Expirado</Badge>;
      case 'none': return <Badge variant="outline">Sin seguro</Badge>;
      default: return <Badge variant="outline">Desconocido</Badge>;
    }
  };

  return {
    devices, searchQuery, setSearchQuery, selectedDevice, setSelectedDevice,
    modelFilter, setModelFilter, insuranceFilter, setInsuranceFilter,
    expirationFilter, setExpirationFilter, currentPage, setCurrentPage,
    showAddModal, setShowAddModal, insuranceStep, setInsuranceStep,
    searchEmail, setSearchEmail, foundClient, setFoundClient,
    clientNotFound, setClientNotFound, showRegisterClient, setShowRegisterClient,
    newClient, setNewClient, newInsurance, setNewInsurance,
    handleSearchClient, handleRegisterNewClient, getStatusBadge,
  };
}
