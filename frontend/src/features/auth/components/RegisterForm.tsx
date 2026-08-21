import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { Stepper } from './Stepper';
import { StepRequestCode } from './StepRequestCode';
import { StepActivation } from './StepActivation';
import { StepCompany } from './StepCompany';
import { StepUser } from './StepUser';
import { StepConfirmation } from './StepConfirmation';

interface RegisterFormProps {
  step: number;
  direction: number;
  activationCode: string;
  setActivationCode: (code: string) => void;
  activationError: string;
  setActivationError: (error: string) => void;
  hasCompanyRegistered: boolean;
  existingCompanyData: any;
  companyData: any;
  setCompanyData: any;
  userData: any;
  setUserData: any;
  errors: Record<string, string>;
  isSubmitting: boolean;
  copied: boolean;
  registeredCompanyCode: string;
  onNextStep: () => void;
  onPreviousStep: () => void;
  onActivationSubmit: (e: React.FormEvent) => void;
  onCompanySubmit: (e: React.FormEvent) => void;
  onUserSubmit: (e: React.FormEvent) => void;
  onGoToLogin: () => void;
  onCopyCode: (code: string) => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  step,
  direction,
  activationCode,
  setActivationCode,
  activationError,
  setActivationError,
  hasCompanyRegistered,
  existingCompanyData,
  companyData,
  setCompanyData,
  userData,
  setUserData,
  errors,
  isSubmitting,
  copied,
  registeredCompanyCode,
  onNextStep,
  onPreviousStep,
  onCompanySubmit,
  onUserSubmit,
  onGoToLogin,
  onCopyCode,
}) => {
  return (
    <div className="w-full max-w-[500px]">
      <Stepper step={step} hasCompanyRegistered={hasCompanyRegistered} />
      <AnimatePresence mode="wait" initial={false}>
        {step === 0 && (
          <StepCompany
            direction={direction}
            companyData={companyData}
            setCompanyData={setCompanyData}
            errors={errors}
            onPreviousStep={onPreviousStep}
            onSubmit={onCompanySubmit}
          />
        )}
        {step === 1 && (
          <StepUser
            direction={direction}
            userData={userData}
            setUserData={setUserData}
            hasCompanyRegistered={hasCompanyRegistered}
            existingCompanyData={existingCompanyData}
            companyData={companyData}
            errors={errors}
            isSubmitting={isSubmitting}
            onPreviousStep={onPreviousStep}
            onSubmit={onUserSubmit}
          />
        )}
        {step === 2 && (
          <StepConfirmation
            direction={direction}
            hasCompanyRegistered={hasCompanyRegistered}
            userData={userData}
            companyData={companyData}
            existingCompanyData={existingCompanyData}
            registeredCompanyCode={registeredCompanyCode}
            copied={copied}
            onCopyCode={onCopyCode}
            onGoToLogin={onGoToLogin}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
export default RegisterForm;
