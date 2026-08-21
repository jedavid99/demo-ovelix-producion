import React from 'react';
import { motion } from 'framer-motion';
import { Building2, MapPin, Phone, Mail, FileText, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '../../../shared/components/ui/button';
import { Input } from '../../../shared/components/ui/input';
import { Label } from '../../../shared/components/ui/label';
import { CompanyData } from '../types/auth.types';
import { STEP_VARIANTS } from '../constants/auth.constants';

interface StepCompanyProps {
  direction: number;
  companyData: CompanyData;
  setCompanyData: React.Dispatch<React.SetStateAction<CompanyData>>;
  errors: Record<string, string>;
  onPreviousStep: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const StepCompany: React.FC<StepCompanyProps> = ({
  direction,
  companyData,
  setCompanyData,
  errors,
  onPreviousStep,
  onSubmit,
}) => {
  return (
    <motion.div
      key="step2"
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
          Datos de la empresa
        </h2>
        <p className="text-sm text-muted-foreground">Ingresa la información de tu negocio.</p>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        {/* Razón Social */}
        <div className="space-y-1.5">
          <Label htmlFor="razonSocial">Razón Social *</Label>
          <Input
            id="razonSocial"
            placeholder="Ej: TechFix S.A."
            value={companyData.razonSocial}
            onChange={(e) => setCompanyData({ ...companyData, razonSocial: e.target.value })}
            leftIcon={<Building2 className="w-5 h-5" />}
            error={errors.razonSocial}
          />
        </div>
        {/* Nombre Fantasía */}
        <div className="space-y-1.5">
          <Label htmlFor="nombreFantasia">Nombre del taller *</Label>
          <Input
            id="nombreFantasia"
            placeholder="Ej: TechFix"
            value={companyData.nombreFantasia}
            onChange={(e) => setCompanyData({ ...companyData, nombreFantasia: e.target.value })}
            leftIcon={<Building2 className="w-5 h-5" />}
            error={errors.nombreFantasia}
          />
        </div>
        {/* Dirección */}
        <div className="space-y-1.5">
          <Label htmlFor="companyAddress">Dirección *</Label>
          <Input
            id="companyAddress"
            placeholder="Ej: Calle Principal 123"
            value={companyData.address}
            onChange={(e) => setCompanyData({ ...companyData, address: e.target.value })}
            leftIcon={<MapPin className="w-5 h-5" />}
            error={errors.address}
          />
        </div>
        {/* Google Maps */}
        <div className="space-y-1.5">
          <Label htmlFor="googleMapsLink">Link de Google Maps (opcional)</Label>
          <Input
            id="googleMapsLink"
            placeholder="Ej: https://maps.google.com/..."
            value={companyData.googleMapsLink}
            onChange={(e) => setCompanyData({ ...companyData, googleMapsLink: e.target.value })}
            leftIcon={<MapPin className="w-5 h-5" />}
          />
        </div>
        {/* Teléfono */}
        <div className="space-y-1.5">
          <Label htmlFor="companyPhone">Teléfono *</Label>
          <Input
            id="companyPhone"
            placeholder="Ej: +34 600 123 456"
            value={companyData.phone}
            onChange={(e) => setCompanyData({ ...companyData, phone: e.target.value })}
            leftIcon={<Phone className="w-5 h-5" />}
            error={errors.phone}
          />
        </div>
        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="companyEmail">Email *</Label>
          <Input
            id="companyEmail"
            type="email"
            placeholder="Ej: info@empresa.com"
            value={companyData.email}
            onChange={(e) => setCompanyData({ ...companyData, email: e.target.value })}
            leftIcon={<Mail className="w-5 h-5" />}
            error={errors.email}
          />
        </div>
        {/* CUIT/CUIL obligatorio */}
        <div className="space-y-1.5">
          <Label htmlFor="companyCuit">CUIT/CUIL <span className="text-destructive">*</span></Label>
          <Input
            id="companyCuit"
            placeholder="Ej: 20-12345678-9"
            value={companyData.cuit}
            onChange={(e) => setCompanyData({ ...companyData, cuit: e.target.value })}
            leftIcon={<FileText className="w-5 h-5" />}
            error={errors.cuit}
          />
        </div>
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onPreviousStep}
            className="flex-1"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Atrás
          </Button>
          <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">
            Continuar
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </form>
    </motion.div>
  );
};
