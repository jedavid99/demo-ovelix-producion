import React from 'react';
import logo from '/ovelix-claro.png';
import { useRegister } from '../hooks/useRegister';
import { RegisterHeader } from '../components/RegisterHeader';
import { RegisterForm } from '../components/RegisterForm';

export default function RegisterPage() {
  const registerState = useRegister();

  return (
    <main className="flex min-h-screen flex-col lg:flex-row bg-background text-foreground select-none">
      {/* Sección Izquierda - Branding */}
      <RegisterHeader />

      {/* Sección Derecha - Formulario y Pasos */}
      <section className="flex-1 flex flex-col justify-between min-h-screen p-6 lg:p-12 relative">
        {/* Logo para Móviles */}
        <div className="w-full lg:hidden flex items-center justify-center py-4">
          <img
            src={logo}
            alt="ovelix"
            loading="lazy"
            className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-white/80 bg-black/30"
          />
        </div>

        <div className="flex-1 flex items-center justify-center py-8">
          <RegisterForm
            step={registerState.step}
            direction={registerState.direction}
            activationCode={registerState.activationCode}
            setActivationCode={registerState.setActivationCode}
            activationError={registerState.activationError}
            setActivationError={registerState.setActivationError}
            hasCompanyRegistered={registerState.hasCompanyRegistered}
            existingCompanyData={registerState.existingCompanyData}
            companyData={registerState.companyData}
            setCompanyData={registerState.setCompanyData}
            userData={registerState.userData}
            setUserData={registerState.setUserData}
            errors={registerState.errors}
            isSubmitting={registerState.isSubmitting}
            copied={registerState.copied}
            onNextStep={registerState.handleNextStep}
            onPreviousStep={registerState.handlePreviousStep}
            onActivationSubmit={registerState.handleActivationSubmit}
            onCompanySubmit={registerState.handleCompanySubmit}
            onUserSubmit={registerState.handleUserSubmit}
            onGoToLogin={registerState.handleGoToLogin}
            onCopyCode={registerState.handleCopyCode}
          />
        </div>
      </section>
    </main>
  );
}
export { RegisterPage as Register };
