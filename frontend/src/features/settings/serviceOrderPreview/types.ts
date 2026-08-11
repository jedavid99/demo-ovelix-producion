export interface ServiceOrderData {
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  orderNumber: string;
  orderDate: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  clientAddress: string;
  clientId: string;
  deviceModel: string;
  deviceImei: string;
  deviceSerial: string;
  deviceColor: string;
  deviceStorage: string;
  deviceDescription: string;
  repairDescription: string;
  repairDiagnostic: string;
  laborCost: string;
  partsCost: string;
  totalPrice: string;
  warrantyMonths: string;
  warrantyTerms: string;
  securityType: 'none' | 'pin' | 'pattern' | 'fingerprint';
  securityPin: string;
  securityPattern: string;
  securityNotes: string;
  technicianName: string;
  technicianNotes: string;
  estimatedTime: string;
  showHeader: boolean;
  showFooter: boolean;
  headerText: string;
  footerText: string;
  showWatermark: boolean;
  watermarkUrl: string;
}

export interface ServiceOrderPreviewProps {
  data: ServiceOrderData;
  className?: string;
}
