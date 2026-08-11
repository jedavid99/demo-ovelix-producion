import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { STEPS_HAS_COMPANY, STEPS_NEW_COMPANY } from '../constants/auth.constants';

interface StepperProps {
  step: number;
  hasCompanyRegistered: boolean;
}

export const Stepper: React.FC<StepperProps> = ({ step, hasCompanyRegistered }) => {
  const steps = hasCompanyRegistered ? STEPS_HAS_COMPANY : STEPS_NEW_COMPANY;

  const getStepStatus = (stepNumber: number) => {
    if (stepNumber < step + 1) return 'completed';
    if (stepNumber === step + 1) return 'current';
    return 'pending';
  };

  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((s, index) => (
        <React.Fragment key={s.number}>
          <div className="flex items-center gap-2">
            <motion.div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                getStepStatus(s.number) === 'completed'
                  ? 'bg-success text-white'
                  : getStepStatus(s.number) === 'current'
                  ? 'bg-primary text-white'
                  : 'bg-muted  text-muted-foreground dark:text-muted-foreground'
              }`}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
            >
              {getStepStatus(s.number) === 'completed' ? <Check className="w-4 h-4" /> : s.number}
            </motion.div>
            <span
              className={`text-xs font-medium ${
                getStepStatus(s.number) === 'current' ? 'text-primary' : 'text-muted-foreground dark:text-muted-foreground'
              }`}
            >
              {s.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-8 h-0.5 ${
                getStepStatus(s.number) === 'completed' ? 'bg-success' : 'bg-muted '
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
