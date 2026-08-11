import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Phone, Key, Lock, Shield, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '../../../shared/components/ui/button';
import { Input } from '../../../shared/components/ui/input';
import { Label } from '../../../shared/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../shared/components/ui/select';
import { UserData, CompanyData } from '../types/auth.types';
import { STEP_VARIANTS, USER_ROLES } from '../constants/auth.constants';

interface StepUserProps {
  direction: number;
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
  hasCompanyRegistered: boolean;
  existingCompanyData: CompanyData | null;
  companyData: CompanyData;
  errors: Record<string, string>;
  isSubmitting: boolean;
  onPreviousStep: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const StepUser: React.FC<StepUserProps> = ({
  direction,
  userData,
  setUserData,
  hasCompanyRegistered,
  existingCompanyData,
  companyData,
  errors,
  isSubmitting,
  onPreviousStep,
  onSubmit,
}) => {
  return (
    <motion.div
      key="step3"
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
          Datos del usuario
        </h2>
        <p className="text-sm text-muted-foreground">Completa tu información personal.</p>
        
        {/* Mostrar código de empresa si ya existe o se ha generado */}
        {hasCompanyRegistered && existingCompanyData && (
          <div className="mt-4 p-4 bg-primary/5 dark:bg-blue-900/30 border border-blue-200 rounded-lg">
            <p className="text-sm font-medium text-primary mb-2">
              Empresa ya registrada: {existingCompanyData.razonSocial}
            </p>
            <p className="text-xs text-muted-foreground">
              Código de empresa: <strong>{existingCompanyData.codigoEmpresa}</strong>
            </p>
          </div>
        )}
        
        {!hasCompanyRegistered && companyData.codigoEmpresa && (
          <div className="mt-4 p-4 bg-primary/5 dark:bg-blue-900/30 border border-blue-200 rounded-lg">
            <p className="text-sm font-medium text-primary mb-2">
              Tu empresa se registrará con el código:
            </p>
            <p className="text-lg font-bold text-primary">{companyData.codigoEmpresa}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Este código será necesario para que otros usuarios accedan a la empresa.
            </p>
          </div>
        )}
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {/* Nombre completo */}
        <div className="space-y-1.5">
          <Label htmlFor="fullName">Nombre completo *</Label>
          <Input
            id="fullName"
            placeholder="Ej: Juan Pérez"
            value={userData.fullName}
            onChange={(e) => setUserData({ ...userData, fullName: e.target.value })}
            leftIcon={<UserPlus className="w-5 h-5" />}
            error={errors.fullName}
          />
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="userEmail">Email *</Label>
          <Input
            id="userEmail"
            type="email"
            placeholder="Ej: juan@empresa.com"
            value={userData.email}
            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
            leftIcon={<Mail className="w-5 h-5" />}
            error={errors.email}
          />
        </div>

        {/* Teléfono */}
        <div className="space-y-1.5">
          <Label htmlFor="userPhone">Teléfono *</Label>
          <Input
            id="userPhone"
            placeholder="Ej: +34 600 123 456"
            value={userData.phone}
            onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
            leftIcon={<Phone className="w-5 h-5" />}
            error={errors.phone}
          />
        </div>

        {/* Código de empresa (solo si es existente) */}
        {hasCompanyRegistered && (
          <div className="space-y-1.5">
            <Label htmlFor="codigoEmpresa">Código de empresa *</Label>
            <Input
              id="codigoEmpresa"
              placeholder="Ej: TF-2024"
              value={userData.codigoEmpresa || ''}
              onChange={(e) =>
                setUserData({ ...userData, codigoEmpresa: e.target.value.toUpperCase() })
              }
              leftIcon={<Key className="w-5 h-5" />}
              error={errors.codigoEmpresa}
            />
            <p className="text-[10px] text-muted-foreground">
              Ingresa el código que te proporcionó el administrador de la empresa.
            </p>
          </div>
        )}

        {/* Rol (solo si empresa existente) */}
        {hasCompanyRegistered && (
          <div className="space-y-1.5">
            <Label htmlFor="role">Rol en la empresa *</Label>
            <Select
              value={userData.role || ''}
              onValueChange={(value) => setUserData({ ...userData, role: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona tu rol" />
              </SelectTrigger>
              <SelectContent>
                {USER_ROLES.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.role && <p className="text-xs text-destructive mt-1">{errors.role}</p>}
          </div>
        )}

        {/* Contraseña */}
        <div className="space-y-1.5">
          <Label htmlFor="password">Contraseña *</Label>
          <Input
            id="password"
            type="password"
            placeholder="Mínimo 6 caracteres"
            value={userData.password}
            onChange={(e) => setUserData({ ...userData, password: e.target.value })}
            leftIcon={<Lock className="w-5 h-5" />}
            error={errors.password}
          />
        </div>

        {/* Confirmar contraseña */}
        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword">Confirmar contraseña *</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Repite tu contraseña"
            value={userData.confirmPassword}
            onChange={(e) => setUserData({ ...userData, confirmPassword: e.target.value })}
            leftIcon={<Shield className="w-5 h-5" />}
            error={errors.confirmPassword}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onPreviousStep}
            className="flex-1"
            disabled={isSubmitting}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Atrás
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-primary hover:bg-primary/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Registrando...' : 'Completar registro'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </form>
    </motion.div>
  );
};
