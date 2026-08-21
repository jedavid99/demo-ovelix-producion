import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, Check, Copy, AlertTriangle, MessageCircle as WhatsAppIcon } from 'lucide-react';
import { Button } from '../../../shared/components/ui/button';
import { UserData, CompanyData } from '../types/auth.types';
import { STEP_VARIANTS } from '../constants/auth.constants';

interface StepConfirmationProps {
  direction: number;
  hasCompanyRegistered: boolean;
  userData: UserData;
  companyData: CompanyData;
  existingCompanyData: CompanyData | null;
  registeredCompanyCode: string;
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
  registeredCompanyCode,
  copied,
  onCopyCode,
  onGoToLogin,
}) => {
  const companyDetails = hasCompanyRegistered ? existingCompanyData : companyData;
  const accessCode = registeredCompanyCode || companyDetails?.codigoEmpresa || 'No disponible';

  const handleWhatsAppRequest = () => {
    const phone = '1234567890'; // REEMPLAZAR CON EL TELÉFONO DEL DESARROLLADOR
    const message = encodeURIComponent(
      `Hola ovelix! 👋\n\nAcabo de completar mi registro en el sistema y me gustaría solicitar la activación de mi cuenta.\n\n👤 *Nombre:* ${userData.nombreUsuario || ''} ${userData.apellidoUsuario || ''}\n📧 *Email:* ${userData.email}\n🏢 *Empresa:* ${companyDetails?.razonSocial || 'No especificada'}\n\n¡Quedo atento a la aprobación!`
    );
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

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
        className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6"
      >
        <CheckCircle2 className="w-16 h-16 text-primary" />
      </motion.div>
      <h2 className="text-2xl font-bold text-foreground tracking-tight mb-3">
        ¡Solicitud enviada!
      </h2>
      <p className="text-sm text-muted-foreground mb-8">
        Tu registro ha sido procesado. Ahora solo falta que un administrador apruebe tu cuenta para que puedas ingresar al sistema.
      </p>

      {/* Botón de WhatsApp - Elemento Firma */}
      <div className="mb-8">
        <Button 
          onClick={handleWhatsAppRequest} 
          className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold py-6 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg flex items-center justify-center gap-3 text-lg"
          size="lg"
        >
          <WhatsAppIcon className="w-6 h-6" />
          Notificar por WhatsApp
        </Button>
        <p className="text-xs text-muted-foreground mt-3 italic">
          Haz clic para agilizar la aprobación de tu cuenta
        </p>
      </div>

      {/* Resumen del registro */}
      <div className="bg-primary/5 dark:bg-blue-900/30 rounded-lg p-4 mb-6 text-left">
        <h3 className="font-semibold text-foreground mb-2 text-sm">Resumen del registro:</h3>
        <div className="space-y-1 text-xs text-muted-foreground">
          <p>
            <strong>Tipo:</strong> {hasCompanyRegistered ? 'Empresa existente' : 'Nueva empresa'}
          </p>
          <p>
            <strong>Nombre:</strong> {userData.nombreUsuario} {userData.apellidoUsuario}
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

      <Button onClick={onGoToLogin} variant="outline" className="w-full" size="lg">
        Ir al login
      </Button>
    </motion.div>
  );
};
