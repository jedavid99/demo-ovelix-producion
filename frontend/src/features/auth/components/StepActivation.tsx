import React from 'react';
import { motion } from 'framer-motion';
import { Key, ArrowRight } from 'lucide-react';
import { Button } from '../../../shared/components/ui/button';
import { Input } from '../../../shared/components/ui/input';
import { Label } from '../../../shared/components/ui/label';
import { STEP_VARIANTS } from '../constants/auth.constants';

interface StepActivationProps {
  direction: number;
  activationCode: string;
  setActivationCode: (code: string) => void;
  activationError: string;
  setActivationError: (error: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onGoToLogin: () => void;
}

export const StepActivation: React.FC<StepActivationProps> = ({
  direction,
  activationCode,
  setActivationCode,
  activationError,
  setActivationError,
  onSubmit,
  onGoToLogin,
}) => {
  return (
    <motion.div
      key="step1"
      custom={direction}
      variants={STEP_VARIANTS}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.3 }}
      className="bg-card rounded-2xl shadow-xl border border-border/60 p-8 lg:p-10"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground tracking-tight mb-2">
          Activación de cuenta
        </h2>
        <p className="text-sm text-muted-foreground">
          Ingresa el código de activación que te proporcionamos por WhatsApp.
        </p>
      </div>
      <form onSubmit={onSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="activationCode">Código de activación</Label>
          <Input
            id="activationCode"
            type="text"
            placeholder="Ej: ovelix-2024"
            value={activationCode}
            onChange={(e) => {
              setActivationCode(e.target.value.toUpperCase());
              setActivationError('');
            }}
            leftIcon={<Key className="w-5 h-5" />}
            className="pl-11"
            error={activationError}
          />
        </div>
        <Button type="submit" className="w-full bg-primary hover:bg-primary/90" size="lg">
          Verificar código
          <ArrowRight className="w-5 h-5" />
        </Button>
      </form>
      <div className="mt-6 text-center">
        <p className="text-xs text-muted-foreground">
          ¿Ya tienes una cuenta?{' '}
          <button onClick={onGoToLogin} className="text-primary font-medium hover:underline">
            Inicia sesión
          </button>
        </p>
      </div>
    </motion.div>
  );
};
