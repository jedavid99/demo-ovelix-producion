import React from 'react';
import { CheckCircle, ChevronRight } from 'lucide-react';
import { STEPS } from '../../constants/sales/sales.constants';

interface StepIndicatorProps {
  currentStep: number;
  onStepClick: (step: number) => void;
}

export const StepIndicator = ({ currentStep, onStepClick }: StepIndicatorProps) => (
  <div className="flex items-center justify-center gap-4">
    {STEPS.map((step, idx) => (
      <React.Fragment key={step}>
        <button
          onClick={() => currentStep >= step && onStepClick(step)}
          className={`w-10 h-10 rounded-full font-semibold flex items-center justify-center transition-all ${
            currentStep >= step
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground'
          }`}
        >
          {currentStep > step ? <CheckCircle size={20} /> : step}
        </button>
        {idx < STEPS.length - 1 && <ChevronRight size={20} className="text-muted-foreground" />}
      </React.Fragment>
    ))}
  </div>
);
