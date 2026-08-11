import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, RefreshCw, CheckCircle2, Copy } from 'lucide-react'
import { Card } from '@/shared/components/ui/card'
import { Label } from '@/shared/components/ui/label'
import { Input } from '@/shared/components/ui/input'
import { Button } from '@/shared/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { SUBSCRIPTION_PLANS, WORKSHOP_TYPES, PAYMENT_METHODS } from '../constants/auth.constants'
import type { SubscriptionPlanKey, CompanyDataEntry } from '../types/auth.types'

interface CodeGeneratorFormProps {
  selectedPlan: SubscriptionPlanKey
  setSelectedPlan: (v: SubscriptionPlanKey) => void
  companyData: CompanyDataEntry
  setCompanyData: (v: CompanyDataEntry) => void
  isGenerating: boolean
  newCode: string
  copiedCode: string | null
  onGenerate: () => void
  onCopy: (code: string) => void
}

export const CodeGeneratorForm: React.FC<CodeGeneratorFormProps> = ({
  selectedPlan, setSelectedPlan, companyData, setCompanyData,
  isGenerating, newCode, copiedCode, onGenerate, onCopy,
}) => {
  const isFormValid = companyData.cuit && companyData.owner && companyData.workshopType && companyData.paymentMethod

  return (
    <Card className="p-6 bg-card dark:bg-card border border-border/60 mb-8">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-1">Generar Nuevo Código</h2>
        <p className="text-sm text-muted-foreground">
          Selecciona el plan de suscripción, ingresa los datos de la empresa y genera el código
        </p>
      </div>
      <div className="mb-6">
        <Label className="text-sm font-semibold text-foreground mb-3 block">Plan de Suscripción</Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {(Object.keys(SUBSCRIPTION_PLANS) as SubscriptionPlanKey[]).map((plan) => (
            <button
              key={plan}
              type="button"
              onClick={() => setSelectedPlan(plan)}
              className={`p-4 border-2 rounded-xl text-left transition-all ${
                selectedPlan === plan
                  ? 'border-primary bg-primary/5/50 dark:bg-blue-950/30'
                  : 'border-border hover:border-primary/50 hover:bg-muted '
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-foreground">{SUBSCRIPTION_PLANS[plan].name}</span>
                <span className="text-sm font-bold text-primary">{SUBSCRIPTION_PLANS[plan].price}</span>
              </div>
              <p className="text-xs text-muted-foreground">{SUBSCRIPTION_PLANS[plan].duration} días de duración</p>
            </button>
          ))}
        </div>
      </div>
      <div className="mb-6">
        <Label className="text-sm font-semibold text-foreground mb-3 block">Datos de la Empresa</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="cuit" className="text-xs text-muted-foreground mb-1 block">CUIT *</Label>
            <Input id="cuit" placeholder="Ej: 20-12345678-9" value={companyData.cuit} onChange={(e) => setCompanyData({ ...companyData, cuit: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="owner" className="text-xs text-muted-foreground mb-1 block">Dueño / Responsable *</Label>
            <Input id="owner" placeholder="Ej: Juan Pérez" value={companyData.owner} onChange={(e) => setCompanyData({ ...companyData, owner: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="workshopType" className="text-xs text-muted-foreground mb-1 block">Tipo de Taller *</Label>
            <Select value={companyData.workshopType} onValueChange={(value) => setCompanyData({ ...companyData, workshopType: value })}>
              <SelectTrigger className="w-full bg-card dark:bg-muted border border-input shadow-sm">
                <SelectValue placeholder="Selecciona tipo" />
              </SelectTrigger>
              <SelectContent className="bg-card dark:bg-muted border border-input shadow-lg">
                {WORKSHOP_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="paymentMethod" className="text-xs text-muted-foreground mb-1 block">Forma de Pago *</Label>
            <Select value={companyData.paymentMethod} onValueChange={(value) => setCompanyData({ ...companyData, paymentMethod: value })}>
              <SelectTrigger className="w-full bg-card dark:bg-muted border border-input shadow-sm">
                <SelectValue placeholder="Selecciona forma de pago" />
              </SelectTrigger>
              <SelectContent className="bg-card dark:bg-muted border border-input shadow-lg">
                {PAYMENT_METHODS.map((m) => (
                  <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Plan seleccionado:</span>{' '}
          {SUBSCRIPTION_PLANS[selectedPlan].name} ({SUBSCRIPTION_PLANS[selectedPlan].duration} días)
        </div>
        <Button onClick={onGenerate} disabled={isGenerating || !isFormValid} className="bg-primary hover:bg-primary/90 flex items-center gap-2">
          {isGenerating ? (
            <><RefreshCw className="w-4 h-4 animate-spin" />Generando...</>
          ) : (
            <><Plus className="w-4 h-4" />Generar Código</>
          )}
        </Button>
      </div>
      {newCode && (
        <AnimatePresence>
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mt-4 p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-success dark:text-green-300" />
                <div>
                  <p className="text-sm font-medium text-foreground">Código generado:</p>
                  <p className="text-lg font-bold text-primary font-mono">{newCode}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => onCopy(newCode)} className="flex items-center gap-2">
                {copiedCode === newCode ? <><CheckCircle2 className="w-4 h-4" />Copiado</> : <><Copy className="w-4 h-4" />Copiar</>}
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </Card>
  )
}
export default CodeGeneratorForm
