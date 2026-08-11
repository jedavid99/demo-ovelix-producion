import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { Button } from '../../../shared/components/ui/button';
import { STEP_VARIANTS, WHATSAPP_REQUEST_URL } from '../constants/auth.constants';

interface StepRequestCodeProps {
  direction: number;
  onNextStep: () => void;
  onGoToLogin: () => void;
}

export const StepRequestCode: React.FC<StepRequestCodeProps> = ({
  direction,
  onNextStep,
  onGoToLogin,
}) => {
  return (
    <motion.div
      key="step0"
      custom={direction}
      variants={STEP_VARIANTS}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.3 }}
      className="bg-card rounded-2xl shadow-xl border border-border/60 p-8 lg:p-10"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-primary tracking-tight mb-2">
          Solicita tu código de activación
        </h2>
        <p className="text-sm text-muted-foreground">
          Para registrarte en ovelix, necesitas un código de activación. Solicítalo a través de
          WhatsApp.
        </p>
      </div>
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-green-100 rounded-full">
            <MessageCircle className="w-6 h-6 text-success" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-primary mb-2">¿Cómo obtener tu código?</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Haz clic en el botón de WhatsApp</li>
              <li>• Envía el mensaje predefinido</li>
              <li>• Recibirás tu código de activación</li>
            </ul>
          </div>
        </div>
      </div>
      <a
        href={WHATSAPP_REQUEST_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full"
      >
        <Button className="w-full bg-success hover:bg-success" size="lg">
          <MessageCircle className="w-5 h-5 mr-2" />
          Solicitar código por WhatsApp
        </Button>
      </a>
      <div className="mt-6 text-center">
        <p className="text-xs text-muted-foreground">
          ¿Ya tienes tu código?{' '}
          <button
            onClick={onNextStep}
            className="text-primary font-medium hover:underline cursor-pointer"
          >
            Ingresa aquí
          </button>
        </p>
      </div>
      <Button variant="outline" onClick={onGoToLogin} className="w-full mt-4">
        Volver al login
      </Button>
    </motion.div>
  );
};
