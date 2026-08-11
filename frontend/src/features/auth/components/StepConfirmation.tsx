import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, Check, Copy, AlertTriangle } from 'lucide-react';
import { Button } from '../../../shared/components/ui/button';
import { UserData, CompanyData } from '../types/auth.types';
import { STEP_VARIANTS } from '../constants/auth.constants';

interface StepConfirmationProps {
  direction: number;
  hasCompanyRegistered: boolean;
  userData: UserData;
  companyData: CompanyData;
  existingCompanyData: CompanyData | null;
  copied: boolean;
  onCopyCode: (code: string) => void;
  onGoToLogin: () => void;
}

export const StepConfirmation: React.FC<StepConfirmationProps> = ({
  direction,
  hasCompanyRegistered,
  userData,
  companyData,
  existingCompanyData,
  copied,
  onCopyCode,
  onGoToLogin,
}) => {
  const companyDetails = hasCompanyRegistered ? existingCompanyData : companyData;
  const accessCode = companyDetails?.codigoEmpresa || 'No disponible';

  return (
    <motion.div
      key="step4"
      custom={direction}
      variants={STEP_VARIANTS}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.3 }}
      className="bg-card rounded-2xl shadow-xl border border-border/60 p-8 lg:p-10 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', duration: 0.5 }}
        className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6"
      >
        <CheckCircle2 className="w-16 h-16 text-success" />
      </motion.div>
      <h2 className="text-2xl font-bold text-foreground tracking-tight mb-3">
        ¡Registro completado!
      </h2>
      <p className="text-sm text-muted-foreground mb-8">
        ¡Gracias por confiar en ovelix! Ahora eres parte de nuestra comunidad de talleres.
      </p>

      {/* Resumen del registro */}
      <div className="bg-primary/5 dark:bg-blue-900/30 rounded-lg p-4 mb-6 text-left">
        <h3 className="font-semibold text-foreground mb-2 text-sm">Resumen del registro:</h3>
        <div className="space-y-1 text-xs text-muted-foreground">
          <p>
            <strong>Tipo:</strong> {hasCompanyRegistered ? 'Empresa existente' : 'Nueva empresa'}
          </p>
          <p>
            <strong>Nombre:</strong> {userData.fullName}
          </p>
          <p>
            <strong>Email:</strong> {userData.email}
          </p>
          <p>
            <strong>Teléfono:</strong> {userData.phone}
          </p>
          {companyDetails?.razonSocial && (
            <p>
              <strong>Empresa:</strong> {companyDetails.razonSocial}
            </p>
          )}
        </div>

        {/* Código de empresa con botón copiar */}
        <div className="mt-4 pt-3 border-t border-blue-200">
          <p className="text-xs font-medium text-foreground">🔑 Código de acceso a la empresa:</p>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-xl font-mono font-bold text-primary">
              {accessCode}
            </p>
            <button
              onClick={() => onCopyCode(accessCode)}
              className="p-2 bg-primary/10 hover:bg-blue-200 rounded-lg transition-colors"
              title="Copiar código"
            >
              {copied ? (
                <Check className="w-4 h-4 text-success" />
              ) : (
                <Copy className="w-4 h-4 text-primary" />
              )}
            </button>
          </div>
          {copied && (
            <p className="text-xs text-success mt-1">¡Copiado al portapapeles!</p>
          )}
          <div className="mt-2 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800">
              <strong>¡Guarda este código!</strong> Es necesario para que los usuarios de tu
              empresa accedan al sistema. Si lo pierdes, contacta con soporte.
            </p>
          </div>
        </div>
      </div>

      <Button onClick={onGoToLogin} className="w-full bg-primary hover:bg-primary/90" size="lg">
        Ir al login
        <ArrowRight className="w-5 h-5 ml-2" />
      </Button>
    </motion.div>
  );
};
