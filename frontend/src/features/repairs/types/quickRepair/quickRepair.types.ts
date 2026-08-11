import React from 'react';

export interface Client {
  id: string;
  nombre_completo: string;
  telefono?: string;
  email?: string;
  dni?: string;
}

export interface QuickRepairFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export interface NewClient {
  nombre_completo: string;
  dni: string;
  telefono: string;
  email: string;
}

export interface UseQuickRepairReturn {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  clientSearch: string;
  setClientSearch: React.Dispatch<React.SetStateAction<string>>;
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
  selectedClient: Client | null;
  setSelectedClient: React.Dispatch<React.SetStateAction<Client | null>>;
  showClientDropdown: boolean;
  setShowClientDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  showNewClientForm: boolean;
  setShowNewClientForm: React.Dispatch<React.SetStateAction<boolean>>;
  newClient: NewClient;
  setNewClient: React.Dispatch<React.SetStateAction<NewClient>>;
  creatingClient: boolean;
  selectedDeviceType: string | null;
  setSelectedDeviceType: React.Dispatch<React.SetStateAction<string | null>>;
  selectedBrand: string;
  setSelectedBrand: React.Dispatch<React.SetStateAction<string>>;
  brandSearch: string;
  setBrandSearch: React.Dispatch<React.SetStateAction<string>>;
  existingBrands: string[];
  showBrandDropdown: boolean;
  setShowBrandDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  model: string;
  setModel: React.Dispatch<React.SetStateAction<string>>;
  serial: string;
  setSerial: React.Dispatch<React.SetStateAction<string>>;
  securityType: string;
  setSecurityType: React.Dispatch<React.SetStateAction<string>>;
  pinCode: string;
  setPinCode: React.Dispatch<React.SetStateAction<string>>;
  patternPoints: string;
  setPatternPoints: React.Dispatch<React.SetStateAction<string>>;
  patternSequence: string;
  setPatternSequence: React.Dispatch<React.SetStateAction<string>>;
  drawnPattern: number[];
  setDrawnPattern: React.Dispatch<React.SetStateAction<number[]>>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  selectedAccessories: string[];
  setSelectedAccessories: React.Dispatch<React.SetStateAction<string[]>>;
  issue: string;
  setIssue: React.Dispatch<React.SetStateAction<string>>;
  priority: string;
  setPriority: React.Dispatch<React.SetStateAction<string>>;
  estimatedCost: string;
  setEstimatedCost: React.Dispatch<React.SetStateAction<string>>;
  deposit: string;
  setDeposit: React.Dispatch<React.SetStateAction<string>>;
  paymentMethod: string;
  setPaymentMethod: React.Dispatch<React.SetStateAction<string>>;
  notes: string;
  setNotes: React.Dispatch<React.SetStateAction<string>>;
  estimatedDate: string;
  setEstimatedDate: React.Dispatch<React.SetStateAction<string>>;
  tieneGarantia: boolean;
  setTieneGarantia: React.Dispatch<React.SetStateAction<boolean>>;
  garantiaDuracion: string;
  setGarantiaDuracion: React.Dispatch<React.SetStateAction<string>>;
  garantiaUnidad: string;
  setGarantiaUnidad: React.Dispatch<React.SetStateAction<string>>;
  fechaInicioGarantia: string;
  setFechaInicioGarantia: React.Dispatch<React.SetStateAction<string>>;
  handleClientSelect: (client: Client) => void;
  handleCreateClient: () => Promise<void>;
  handleShowNewClientForm: () => void;
  handleCanvasClick: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  clearPattern: () => void;
  getSecurityOptions: () => string[];
  getSecurityLabel: (value: string) => string;
  getAccessories: () => { id: string; label: string }[];
  toggleAccessory: (accessoryId: string) => void;
  handleNext: () => void;
  handleBack: () => void;
  handleSubmit: () => Promise<void>;
  DEVICE_TYPES: { id: string; name: string; icon: React.ComponentType<any> }[];
  onSuccess?: () => void;
  onCancel?: () => void;
}
