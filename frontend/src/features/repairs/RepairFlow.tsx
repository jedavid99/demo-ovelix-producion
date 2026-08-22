import React, { useState, useCallback } from 'react';
import { toast } from '@/shared/components/ui/use-toast';
import RepairAdd from './components/RepairAdd';
import RepairTechnical from './Technical';
import RepairFinalize from './Finalize';
export interface RepairData {
  // Step 1 data
  selectedClient: { id: string; name: string; phone: string; email: string } | null;
  deviceType: string;
  brand: string;
  model: string;
  serial: string;
  aestheticCondition: string;
  accessories: string[];
  issueDescription: string;
  priority: string;
  estimatedDays: number;
  
  // Step 2 data
  hardwareChecks: Record<string, boolean>;
  securityType: string;
  accessPin: string;
  patternDots: boolean[];
  patternSequence?: number[];
  technicianNotes: string;
  
  // Step 3 data
  termsAccepted: boolean;
  signaturePad: string;
  printOption: string;
}
export default function RepairFlow() {
  const [currentStep, setCurrentStep] = useState(1);
  
  const [data, setData] = useState<RepairData>({
    // Step 1 data
    selectedClient: null,
    deviceType: 'phone',
    brand: '',
    model: '',
    serial: '',
    aestheticCondition: '',
    accessories: [],
    issueDescription: '',
    priority: 'medium',
    estimatedDays: 3,
    
    // Step 2 data
    hardwareChecks: {
    audio: true,
      botonPawer: true,
      botonVolumen: true,
      sensorProximidad: true,
      camaraFrontal: true,
      modulo: false,
      wifi: true,
      huella: true,
      camaraTrasera: true,
      altavoz: true,
      fichaCarga: false,
      bateria: true,
      lectorSimcard: true
    },
    securityType: 'pin',
    accessPin: '920431',
    patternDots: [
      true, false, false,
      true, true, false,
      false, false, true,
    ],
    patternSequence: [],
    technicianNotes: '',
    
    // Step 3 data
    termsAccepted: false,
    signaturePad: '',
    printOption: 'both',
  });
  const updateData = useCallback((updates: Partial<RepairData>) => {
    setData(prev => ({ ...prev, ...updates }));
  }, []);
  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };
  const handleComplete = () => {
    toast({ title: 'Éxito', description: 'Reparación completada e impresa!' });
  };
  return (
    <div>
      {currentStep === 1 && (
        <RepairAdd 
          data={data}
          updateData={updateData}
          onNext={handleNext}
          currentStep={currentStep}
        />
      )}
      
      {currentStep === 2 && (
        <RepairTechnical 
          data={data}
          updateData={updateData}
          onNext={handleNext}
          onBack={handleBack}
          currentStep={currentStep}
        />
      )}
      
      {currentStep === 3 && (
        <RepairFinalize 
          data={data}
          updateData={updateData}
          onBack={handleBack}
          onComplete={handleComplete}
          currentStep={currentStep}
        />
      )}
    </div>
  );
}
