import { useState, useRef } from 'react';
import type { Client, NewClient } from '../../../types/quickRepair/quickRepair.types';

export function useQuickRepairState() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [clientSearch, setClientSearch] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [showNewClientForm, setShowNewClientForm] = useState(false);
  const [newClient, setNewClient] = useState<NewClient>({ nombre_completo: '', dni: '', telefono: '', email: '' });
  const [creatingClient, setCreatingClient] = useState(false);

  const [selectedDeviceType, setSelectedDeviceType] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [brandSearch, setBrandSearch] = useState('');
  const [existingBrands, setExistingBrands] = useState<string[]>([]);
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [model, setModel] = useState('');
  const [serial, setSerial] = useState('');

  const [securityType, setSecurityType] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [patternPoints, setPatternPoints] = useState('');
  const [patternSequence, setPatternSequence] = useState('');
  const [drawnPattern, setDrawnPattern] = useState<number[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([]);

  const [issue, setIssue] = useState('');
  const [priority, setPriority] = useState('medium');
  const [estimatedCost, setEstimatedCost] = useState('');
  const [deposit, setDeposit] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [notes, setNotes] = useState('');
  const [estimatedDate, setEstimatedDate] = useState('');

  const [tieneGarantia, setTieneGarantia] = useState(false);
  const [garantiaDuracion, setGarantiaDuracion] = useState('');
  const [garantiaUnidad, setGarantiaUnidad] = useState('MESES');
  const [fechaInicioGarantia, setFechaInicioGarantia] = useState('');

  return {
    step, setStep, loading, setLoading, error, setError,
    clientSearch, setClientSearch, clients, setClients,
    selectedClient, setSelectedClient, showClientDropdown, setShowClientDropdown,
    showNewClientForm, setShowNewClientForm, newClient, setNewClient, creatingClient, setCreatingClient,
    selectedDeviceType, setSelectedDeviceType, selectedBrand, setSelectedBrand,
    brandSearch, setBrandSearch, existingBrands, setExistingBrands,
    showBrandDropdown, setShowBrandDropdown, model, setModel, serial, setSerial,
    securityType, setSecurityType, pinCode, setPinCode,
    patternPoints, setPatternPoints, patternSequence, setPatternSequence,
    drawnPattern, setDrawnPattern, canvasRef,
    selectedAccessories, setSelectedAccessories,
    issue, setIssue, priority, setPriority,
    estimatedCost, setEstimatedCost, deposit, setDeposit,
    paymentMethod, setPaymentMethod, notes, setNotes, estimatedDate, setEstimatedDate,
    tieneGarantia, setTieneGarantia, garantiaDuracion, setGarantiaDuracion,
    garantiaUnidad, setGarantiaUnidad, fechaInicioGarantia, setFechaInicioGarantia,
  };
}
